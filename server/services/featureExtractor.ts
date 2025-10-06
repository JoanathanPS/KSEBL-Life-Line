/**
 * Feature extraction service for waveform analysis
 * Extracts relevant features from electrical waveforms for ML model
 * Follows .cursorrules standards for service layer
 */

export interface WaveformData {
  currentR: number[];
  currentY: number[];
  currentB: number[];
  voltageR: number[];
  voltageY: number[];
  voltageB: number[];
  samplingRate: number;
  durationSeconds: number;
}

export interface ExtractedFeatures {
  // RMS values
  currentRmsR: number;
  currentRmsY: number;
  currentRmsB: number;
  voltageRmsR: number;
  voltageRmsY: number;
  voltageRmsB: number;

  // Peak values
  currentPeakR: number;
  currentPeakY: number;
  currentPeakB: number;
  voltagePeakR: number;
  voltagePeakY: number;
  voltagePeakB: number;

  // Harmonic analysis
  thdCurrentR: number; // Total Harmonic Distortion
  thdCurrentY: number;
  thdCurrentB: number;
  thdVoltageR: number;
  thdVoltageY: number;
  thdVoltageB: number;

  // Symmetrical components
  positiveSequenceCurrent: number;
  negativeSequenceCurrent: number;
  zeroSequenceCurrent: number;
  positiveSequenceVoltage: number;
  negativeSequenceVoltage: number;
  zeroSequenceVoltage: number;

  // Power analysis
  activePowerR: number;
  activePowerY: number;
  activePowerB: number;
  reactivePowerR: number;
  reactivePowerY: number;
  reactivePowerB: number;

  // Frequency analysis
  fundamentalFrequency: number;
  frequencyDeviation: number;

  // Statistical features
  currentSkewness: number;
  currentKurtosis: number;
  voltageSkewness: number;
  voltageKurtosis: number;

  // Fault indicators
  currentUnbalance: number;
  voltageUnbalance: number;
  currentDropRatio: number;
  voltageDropRatio: number;
}

export class FeatureExtractor {
  private readonly samplingRate: number;
  private readonly fundamentalFreq: number = 50; // 50 Hz for Indian grid

  constructor(samplingRate: number = 10000) {
    this.samplingRate = samplingRate;
  }

  /**
   * Extract all features from waveform data
   */
  extractFeatures(waveformData: WaveformData): ExtractedFeatures {
    const { currentR, currentY, currentB, voltageR, voltageY, voltageB } = waveformData;

    return {
      // RMS values
      currentRmsR: this.calculateRMS(currentR),
      currentRmsY: this.calculateRMS(currentY),
      currentRmsB: this.calculateRMS(currentB),
      voltageRmsR: this.calculateRMS(voltageR),
      voltageRmsY: this.calculateRMS(voltageY),
      voltageRmsB: this.calculateRMS(voltageB),

      // Peak values
      currentPeakR: Math.max(...currentR.map(Math.abs)),
      currentPeakY: Math.max(...currentY.map(Math.abs)),
      currentPeakB: Math.max(...currentB.map(Math.abs)),
      voltagePeakR: Math.max(...voltageR.map(Math.abs)),
      voltagePeakY: Math.max(...voltageY.map(Math.abs)),
      voltagePeakB: Math.max(...voltageB.map(Math.abs)),

      // Harmonic analysis
      thdCurrentR: this.calculateTHD(currentR),
      thdCurrentY: this.calculateTHD(currentY),
      thdCurrentB: this.calculateTHD(currentB),
      thdVoltageR: this.calculateTHD(voltageR),
      thdVoltageY: this.calculateTHD(voltageY),
      thdVoltageB: this.calculateTHD(voltageB),

      // Symmetrical components
      ...this.calculateSymmetricalComponents(currentR, currentY, currentB, voltageR, voltageY, voltageB),

      // Power analysis
      activePowerR: this.calculateActivePower(currentR, voltageR),
      activePowerY: this.calculateActivePower(currentY, voltageY),
      activePowerB: this.calculateActivePower(currentB, voltageB),
      reactivePowerR: this.calculateReactivePower(currentR, voltageR),
      reactivePowerY: this.calculateReactivePower(currentY, voltageY),
      reactivePowerB: this.calculateReactivePower(currentB, voltageB),

      // Frequency analysis
      fundamentalFrequency: this.estimateFrequency(currentR),
      frequencyDeviation: this.calculateFrequencyDeviation(currentR),

      // Statistical features
      currentSkewness: this.calculateSkewness([...currentR, ...currentY, ...currentB]),
      currentKurtosis: this.calculateKurtosis([...currentR, ...currentY, ...currentB]),
      voltageSkewness: this.calculateSkewness([...voltageR, ...voltageY, ...voltageB]),
      voltageKurtosis: this.calculateKurtosis([...voltageR, ...voltageY, ...voltageB]),

      // Fault indicators
      currentUnbalance: this.calculateCurrentUnbalance(currentR, currentY, currentB),
      voltageUnbalance: this.calculateVoltageUnbalance(voltageR, voltageY, voltageB),
      currentDropRatio: this.calculateCurrentDropRatio(currentR, currentY, currentB),
      voltageDropRatio: this.calculateVoltageDropRatio(voltageR, voltageY, voltageB),
    };
  }

  /**
   * Calculate RMS value
   */
  private calculateRMS(signal: number[]): number {
    const sumOfSquares = signal.reduce((sum, value) => sum + value * value, 0);
    return Math.sqrt(sumOfSquares / signal.length);
  }

  /**
   * Calculate Total Harmonic Distortion (THD)
   */
  private calculateTHD(signal: number[]): number {
    const fft = this.performFFT(signal);
    const fundamental = Math.abs(fft[Math.floor(this.fundamentalFreq * signal.length / this.samplingRate)]);
    const harmonics = fft.slice(1).reduce((sum, value) => sum + Math.abs(value), 0);
    
    return fundamental > 0 ? harmonics / fundamental : 0;
  }

  /**
   * Calculate symmetrical components
   */
  private calculateSymmetricalComponents(
    currentR: number[],
    currentY: number[],
    currentB: number[],
    voltageR: number[],
    voltageY: number[],
    voltageB: number[]
  ) {
    const alpha = Math.exp(2 * Math.PI * 1j / 3);
    
    // Convert to complex numbers and calculate symmetrical components
    const currentRmsR = this.calculateRMS(currentR);
    const currentRmsY = this.calculateRMS(currentY);
    const currentRmsB = this.calculateRMS(currentB);
    
    const voltageRmsR = this.calculateRMS(voltageR);
    const voltageRmsY = this.calculateRMS(voltageY);
    const voltageRmsB = this.calculateRMS(voltageB);

    // Positive sequence
    const positiveSequenceCurrent = Math.sqrt(
      (currentRmsR * currentRmsR + currentRmsY * currentRmsY + currentRmsB * currentRmsB) / 3
    );
    const positiveSequenceVoltage = Math.sqrt(
      (voltageRmsR * voltageRmsR + voltageRmsY * voltageRmsY + voltageRmsB * voltageRmsB) / 3
    );

    // Negative sequence (simplified calculation)
    const negativeSequenceCurrent = Math.abs(currentRmsR - currentRmsY) / 2;
    const negativeSequenceVoltage = Math.abs(voltageRmsR - voltageRmsY) / 2;

    // Zero sequence
    const zeroSequenceCurrent = Math.abs(currentRmsR + currentRmsY + currentRmsB) / 3;
    const zeroSequenceVoltage = Math.abs(voltageRmsR + voltageRmsY + voltageRmsB) / 3;

    return {
      positiveSequenceCurrent,
      negativeSequenceCurrent,
      zeroSequenceCurrent,
      positiveSequenceVoltage,
      negativeSequenceVoltage,
      zeroSequenceVoltage,
    };
  }

  /**
   * Calculate active power
   */
  private calculateActivePower(current: number[], voltage: number[]): number {
    let power = 0;
    for (let i = 0; i < current.length; i++) {
      power += current[i] * voltage[i];
    }
    return power / current.length;
  }

  /**
   * Calculate reactive power (simplified)
   */
  private calculateReactivePower(current: number[], voltage: number[]): number {
    // Simplified reactive power calculation
    const currentRms = this.calculateRMS(current);
    const voltageRms = this.calculateRMS(voltage);
    const apparentPower = currentRms * voltageRms;
    const activePower = this.calculateActivePower(current, voltage);
    return Math.sqrt(Math.max(0, apparentPower * apparentPower - activePower * activePower));
  }

  /**
   * Estimate fundamental frequency
   */
  private estimateFrequency(signal: number[]): number {
    const fft = this.performFFT(signal);
    let maxIndex = 0;
    let maxValue = 0;

    for (let i = 1; i < fft.length / 2; i++) {
      const magnitude = Math.abs(fft[i]);
      if (magnitude > maxValue) {
        maxValue = magnitude;
        maxIndex = i;
      }
    }

    return (maxIndex * this.samplingRate) / signal.length;
  }

  /**
   * Calculate frequency deviation
   */
  private calculateFrequencyDeviation(signal: number[]): number {
    const estimatedFreq = this.estimateFrequency(signal);
    return Math.abs(estimatedFreq - this.fundamentalFreq);
  }

  /**
   * Calculate skewness
   */
  private calculateSkewness(signal: number[]): number {
    const mean = signal.reduce((sum, val) => sum + val, 0) / signal.length;
    const variance = signal.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / signal.length;
    const stdDev = Math.sqrt(variance);
    
    if (stdDev === 0) return 0;
    
    const skewness = signal.reduce((sum, val) => sum + Math.pow((val - mean) / stdDev, 3), 0) / signal.length;
    return skewness;
  }

  /**
   * Calculate kurtosis
   */
  private calculateKurtosis(signal: number[]): number {
    const mean = signal.reduce((sum, val) => sum + val, 0) / signal.length;
    const variance = signal.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / signal.length;
    const stdDev = Math.sqrt(variance);
    
    if (stdDev === 0) return 0;
    
    const kurtosis = signal.reduce((sum, val) => sum + Math.pow((val - mean) / stdDev, 4), 0) / signal.length;
    return kurtosis - 3; // Excess kurtosis
  }

  /**
   * Calculate current unbalance
   */
  private calculateCurrentUnbalance(currentR: number[], currentY: number[], currentB: number[]): number {
    const rmsR = this.calculateRMS(currentR);
    const rmsY = this.calculateRMS(currentY);
    const rmsB = this.calculateRMS(currentB);
    
    const max = Math.max(rmsR, rmsY, rmsB);
    const min = Math.min(rmsR, rmsY, rmsB);
    
    return max > 0 ? ((max - min) / max) * 100 : 0;
  }

  /**
   * Calculate voltage unbalance
   */
  private calculateVoltageUnbalance(voltageR: number[], voltageY: number[], voltageB: number[]): number {
    const rmsR = this.calculateRMS(voltageR);
    const rmsY = this.calculateRMS(voltageY);
    const rmsB = this.calculateRMS(voltageB);
    
    const max = Math.max(rmsR, rmsY, rmsB);
    const min = Math.min(rmsR, rmsY, rmsB);
    
    return max > 0 ? ((max - min) / max) * 100 : 0;
  }

  /**
   * Calculate current drop ratio
   */
  private calculateCurrentDropRatio(currentR: number[], currentY: number[], currentB: number[]): number {
    const initialRms = this.calculateRMS(currentR.slice(0, Math.floor(currentR.length * 0.1)));
    const finalRms = this.calculateRMS(currentR.slice(-Math.floor(currentR.length * 0.1)));
    
    return initialRms > 0 ? (initialRms - finalRms) / initialRms : 0;
  }

  /**
   * Calculate voltage drop ratio
   */
  private calculateVoltageDropRatio(voltageR: number[], voltageY: number[], voltageB: number[]): number {
    const initialRms = this.calculateRMS(voltageR.slice(0, Math.floor(voltageR.length * 0.1)));
    const finalRms = this.calculateRMS(voltageR.slice(-Math.floor(voltageR.length * 0.1)));
    
    return initialRms > 0 ? (initialRms - finalRms) / initialRms : 0;
  }

  /**
   * Simplified FFT implementation
   */
  private performFFT(signal: number[]): number[] {
    // Simplified FFT - in production, use a proper FFT library
    const N = signal.length;
    const fft = new Array(N).fill(0);
    
    for (let k = 0; k < N; k++) {
      let real = 0;
      let imag = 0;
      
      for (let n = 0; n < N; n++) {
        const angle = -2 * Math.PI * k * n / N;
        real += signal[n] * Math.cos(angle);
        imag += signal[n] * Math.sin(angle);
      }
      
      fft[k] = Math.sqrt(real * real + imag * imag);
    }
    
    return fft;
  }
}
