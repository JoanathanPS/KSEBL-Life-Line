import nodemailer from 'nodemailer';
import twilio from 'twilio';
import { ApiError } from '../utils/ApiError.js';
import { db } from '../db.js';
import { alerts, users, lineBreakEvents, feeders, substations } from '../../shared/schema.js';
import { eq } from 'drizzle-orm';

/**
 * Alert Service for sending email and SMS notifications
 * Follows .cursorrules standards for service layer
 */

export interface AlertRecipient {
  id: string;
  email: string;
  phone: string;
  fullName: string;
  role: string;
}

export interface EventAlertData {
  eventId: string;
  feederId: string;
  detectedAt: string;
  estimatedLocationKm: number;
  severity: string;
  confidenceScore: number;
  faultType: string;
}

export interface AlertResult {
  type: 'email' | 'sms';
  recipient: string;
  status: 'sent' | 'failed';
  messageId?: string;
  error?: string;
}

export class AlertService {
  private emailTransporter: nodemailer.Transporter | null = null;
  private twilioClient: any = null;
  private isEmailConfigured: boolean = false;
  private isSmsConfigured: boolean = false;

  constructor() {
    this.initializeEmailService();
    this.initializeSmsService();
  }

  /**
   * Initialize email service
   */
  private initializeEmailService(): void {
    try {
      const smtpConfig = {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      };

      if (smtpConfig.host && smtpConfig.auth.user && smtpConfig.auth.pass) {
        this.emailTransporter = nodemailer.createTransporter(smtpConfig);
        this.isEmailConfigured = true;
        console.log('✅ Email service configured');
      } else {
        console.log('⚠️  Email service not configured - missing SMTP credentials');
      }
    } catch (error) {
      console.error('❌ Failed to initialize email service:', error);
    }
  }

  /**
   * Initialize SMS service
   */
  private initializeSmsService(): void {
    try {
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;

      if (accountSid && authToken) {
        this.twilioClient = twilio(accountSid, authToken);
        this.isSmsConfigured = true;
        console.log('✅ SMS service configured');
      } else {
        console.log('⚠️  SMS service not configured - missing Twilio credentials');
      }
    } catch (error) {
      console.error('❌ Failed to initialize SMS service:', error);
    }
  }

  /**
   * Send alerts for a line break event
   */
  async sendEventAlerts(eventData: EventAlertData): Promise<AlertResult[]> {
    try {
      // Get feeder and substation details
      const eventDetails = await this.getEventDetails(eventData.eventId);
      if (!eventDetails) {
        throw new Error('Event details not found');
      }

      // Get recipients based on event severity and user roles
      const recipients = await this.getAlertRecipients(eventData.severity);
      
      const alertResults: AlertResult[] = [];

      // Send alerts to all recipients
      for (const recipient of recipients) {
        const alerts = await this.sendAlertsToRecipient(recipient, eventData, eventDetails);
        alertResults.push(...alerts);
      }

      // Log all alerts to database
      await this.logAlertsToDatabase(eventData.eventId, alertResults);

      console.log(`✅ Sent ${alertResults.length} alerts for event ${eventData.eventId}`);
      return alertResults;
    } catch (error) {
      console.error('Error sending event alerts:', error);
      throw ApiError.internal('Failed to send alerts');
    }
  }

  /**
   * Get event details including feeder and substation info
   */
  private async getEventDetails(eventId: string) {
    const result = await db
      .select({
        eventId: lineBreakEvents.id,
        feederName: feeders.name,
        feederCode: feeders.code,
        substationName: substations.name,
        substationCode: substations.code,
      })
      .from(lineBreakEvents)
      .innerJoin(feeders, eq(lineBreakEvents.feederId, feeders.id))
      .innerJoin(substations, eq(feeders.substationId, substations.id))
      .where(eq(lineBreakEvents.id, eventId))
      .limit(1);

    return result[0] || null;
  }

  /**
   * Get alert recipients based on severity
   */
  private async getAlertRecipients(severity: string): Promise<AlertRecipient[]> {
    let roles: string[] = [];

    // Determine roles to notify based on severity
    switch (severity) {
      case 'critical':
        roles = ['admin', 'operator', 'field_crew'];
        break;
      case 'high':
        roles = ['admin', 'operator', 'field_crew'];
        break;
      case 'medium':
        roles = ['admin', 'operator'];
        break;
      case 'low':
        roles = ['admin'];
        break;
      default:
        roles = ['admin', 'operator'];
    }

    const recipients = await db
      .select({
        id: users.id,
        email: users.email,
        phone: users.phone,
        fullName: users.fullName,
        role: users.role,
      })
      .from(users)
      .where(eq(users.isActive, true))
      .limit(50); // Limit to prevent spam

    return recipients.filter(user => roles.includes(user.role));
  }

  /**
   * Send alerts to a specific recipient
   */
  private async sendAlertsToRecipient(
    recipient: AlertRecipient,
    eventData: EventAlertData,
    eventDetails: any
  ): Promise<AlertResult[]> {
    const results: AlertResult[] = [];

    // Send email if configured and recipient has email
    if (this.isEmailConfigured && recipient.email) {
      try {
        const emailResult = await this.sendEmailAlert(recipient, eventData, eventDetails);
        results.push({
          type: 'email',
          recipient: recipient.email,
          status: 'sent',
          messageId: emailResult.messageId,
        });
      } catch (error) {
        results.push({
          type: 'email',
          recipient: recipient.email,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    // Send SMS if configured, recipient has phone, and is field crew
    if (this.isSmsConfigured && recipient.phone && recipient.role === 'field_crew') {
      try {
        const smsResult = await this.sendSmsAlert(recipient, eventData, eventDetails);
        results.push({
          type: 'sms',
          recipient: recipient.phone,
          status: 'sent',
          messageId: smsResult.sid,
        });
      } catch (error) {
        results.push({
          type: 'sms',
          recipient: recipient.phone,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return results;
  }

  /**
   * Send email alert
   */
  private async sendEmailAlert(
    recipient: AlertRecipient,
    eventData: EventAlertData,
    eventDetails: any
  ): Promise<any> {
    if (!this.emailTransporter) {
      throw new Error('Email service not configured');
    }

    const subject = `🚨 ${eventData.faultType} DETECTED - ${eventDetails.substationName}`;
    
    const html = this.generateEmailTemplate(recipient, eventData, eventDetails);

    const info = await this.emailTransporter.sendMail({
      from: process.env.SMTP_FROM || 'Kerala KSEBL Alerts <alerts@ksebl.gov.in>',
      to: recipient.email,
      subject,
      html,
    });

    return info;
  }

  /**
   * Send SMS alert
   */
  private async sendSmsAlert(
    recipient: AlertRecipient,
    eventData: EventAlertData,
    eventDetails: any
  ): Promise<any> {
    if (!this.twilioClient) {
      throw new Error('SMS service not configured');
    }

    const message = this.generateSmsMessage(recipient, eventData, eventDetails);

    const sms = await this.twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: recipient.phone,
    });

    return sms;
  }

  /**
   * Generate email HTML template
   */
  private generateEmailTemplate(
    recipient: AlertRecipient,
    eventData: EventAlertData,
    eventDetails: any
  ): string {
    const severityColor = this.getSeverityColor(eventData.severity);
    const currentTime = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
    });

    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa;">
        <div style="background-color: ${severityColor}; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">⚠️ ${eventData.faultType} DETECTED</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Kerala State Electricity Board</p>
        </div>
        
        <div style="padding: 20px; background-color: white;">
          <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <p style="margin: 0; font-weight: bold; color: #856404;">
              URGENT: ${eventData.faultType} detected in the electrical grid
            </p>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr style="background-color: #f8f9fa;">
              <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Substation:</td>
              <td style="padding: 12px; border: 1px solid #dee2e6;">${eventDetails.substationName} (${eventDetails.substationCode})</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Feeder:</td>
              <td style="padding: 12px; border: 1px solid #dee2e6;">${eventDetails.feederName} (${eventDetails.feederCode})</td>
            </tr>
            <tr style="background-color: #f8f9fa;">
              <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Location:</td>
              <td style="padding: 12px; border: 1px solid #dee2e6;">${eventData.estimatedLocationKm.toFixed(2)} km from substation</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Severity:</td>
              <td style="padding: 12px; border: 1px solid #dee2e6; text-transform: uppercase; color: ${severityColor}; font-weight: bold;">${eventData.severity}</td>
            </tr>
            <tr style="background-color: #f8f9fa;">
              <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Confidence:</td>
              <td style="padding: 12px; border: 1px solid #dee2e6;">${(eventData.confidenceScore * 100).toFixed(1)}%</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Detected At:</td>
              <td style="padding: 12px; border: 1px solid #dee2e6;">${new Date(eventData.detectedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
            </tr>
          </table>

          <div style="background-color: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <p style="margin: 0; font-weight: bold; color: #0c5460;">Action Required:</p>
            <p style="margin: 5px 0 0 0; color: #0c5460;">
              Please acknowledge this alert and dispatch field crew immediately if required.
            </p>
          </div>

          <div style="text-align: center; margin: 20px 0;">
            <a href="${process.env.FRONTEND_URL}/events/${eventData.eventId}" 
               style="background-color: ${severityColor}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              View Event Details
            </a>
          </div>
        </div>

        <div style="background-color: #f8f9fa; padding: 15px; text-align: center; color: #6c757d; font-size: 12px;">
          <p style="margin: 0;">This is an automated alert from Kerala LT Line Break Detection System.</p>
          <p style="margin: 5px 0 0 0;">Kerala State Electricity Board Limited (KSEBL)</p>
          <p style="margin: 5px 0 0 0;">Generated at: ${currentTime}</p>
        </div>
      </div>
    `;
  }

  /**
   * Generate SMS message
   */
  private generateSmsMessage(
    recipient: AlertRecipient,
    eventData: EventAlertData,
    eventDetails: any
  ): string {
    return `
🚨 KSEBL ${eventData.faultType} ALERT

Substation: ${eventDetails.substationName}
Feeder: ${eventDetails.feederCode}
Location: ${eventData.estimatedLocationKm.toFixed(2)} km
Severity: ${eventData.severity.toUpperCase()}
Confidence: ${(eventData.confidenceScore * 100).toFixed(1)}%
Time: ${new Date(eventData.detectedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

Immediate action required!
View: ${process.env.FRONTEND_URL}/events/${eventData.eventId}

Kerala State Electricity Board
    `.trim();
  }

  /**
   * Get color for severity level
   */
  private getSeverityColor(severity: string): string {
    switch (severity.toLowerCase()) {
      case 'critical':
        return '#dc3545';
      case 'high':
        return '#fd7e14';
      case 'medium':
        return '#ffc107';
      case 'low':
        return '#28a745';
      default:
        return '#6c757d';
    }
  }

  /**
   * Log alerts to database
   */
  private async logAlertsToDatabase(eventId: string, alertResults: AlertResult[]): Promise<void> {
    try {
      const alertRecords = alertResults.map(result => ({
        eventId,
        alertType: result.type,
        recipientContact: result.recipient,
        message: result.type === 'email' ? 'Email alert sent' : 'SMS alert sent',
        sentAt: result.status === 'sent' ? new Date() : null,
        status: result.status,
        errorMessage: result.error || null,
      }));

      await db.insert(alerts).values(alertRecords);
    } catch (error) {
      console.error('Failed to log alerts to database:', error);
    }
  }

  /**
   * Send test alert
   */
  async sendTestAlert(recipientEmail: string, recipientPhone?: string): Promise<AlertResult[]> {
    const testEventData: EventAlertData = {
      eventId: 'test-event-id',
      feederId: 'test-feeder-id',
      detectedAt: new Date().toISOString(),
      estimatedLocationKm: 2.5,
      severity: 'medium',
      confidenceScore: 0.85,
      faultType: 'LINE_BREAK',
    };

    const testEventDetails = {
      substationName: 'Test Substation',
      substationCode: 'TEST-001',
      feederName: 'Test Feeder',
      feederCode: 'TEST-F01',
    };

    const testRecipient: AlertRecipient = {
      id: 'test-user-id',
      email: recipientEmail,
      phone: recipientPhone || '',
      fullName: 'Test User',
      role: 'operator',
    };

    return this.sendAlertsToRecipient(testRecipient, testEventData, testEventDetails);
  }

  /**
   * Get service status
   */
  getServiceStatus(): {
    email: boolean;
    sms: boolean;
  } {
    return {
      email: this.isEmailConfigured,
      sms: this.isSmsConfigured,
    };
  }
}

// Export singleton instance
export const alertService = new AlertService();
