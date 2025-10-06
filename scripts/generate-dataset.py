#!/usr/bin/env python3
"""
Kerala Grid Data Generator
Generates 10,000 realistic waveform samples for Kerala electrical grid
"""

import numpy as np
import pandas as pd
from scipy import signal
import json
from datetime import datetime, timedelta
import random
import os
import sys

class KeralaGridDataGenerator:
    """
    Generate realistic waveform samples for Kerala grid
    Based on actual Kerala State Electricity Board characteristics
    """
    
    def __init__(self):
        self.sampling_rate = 10000  # 10 kHz
        self.fundamental_freq = 50  # 50 Hz for Indian grid
        self.voltage_level = 11000  # 11 kV distribution
        self.feeders = self._generate_feeder_list()
        
    def _generate_feeder_list(self):
        """Generate Kerala KSEBL feeders based on actual districts"""
        districts = [
            'Trivandrum', 'Kollam', 'Pathanamthitta', 'Alappuzha', 
            'Kottayam', 'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad',
            'Malappuram', 'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod'
        ]
        
        feeders = []
        for district in districts:
            # Generate 25 feeders per district (350 total)
            for i in range(1, 26):
                feeders.append({
                    'id': f'{district[:3].upper()}-F{i:03d}',
                    'name': f'{district} Feeder {i}',
                    'district': district,
                    'voltage': 11000,  # 11 kV
                    'length_km': round(random.uniform(2, 15), 2),
                    'area_type': random.choice(['urban', 'rural', 'semi-urban']),
                    'typical_load_kw': round(random.uniform(50, 500), 2),
                    'num_consumers': random.randint(20, 200),
                })
        return feeders
    
    def generate_dataset(self, num_samples=10000):
        """Generate balanced dataset with all fault types"""
        samples_per_class = num_samples // 4
        
        all_data = []
        
        print(f"Generating {num_samples} samples...")
        print(f"Samples per class: {samples_per_class}")
        
        # Generate each class
        for class_name, generator_func in [
            ('NORMAL', self._generate_normal),
            ('LINE_BREAK', self._generate_line_break),
            ('SHORT_CIRCUIT', self._generate_short_circuit),
            ('OVERLOAD', self._generate_overload)
        ]:
            print(f"\nGenerating {samples_per_class} {class_name} samples...")
            for i in range(samples_per_class):
                sample = generator_func()
                sample['label'] = class_name
                sample['sample_id'] = len(all_data) + 1
                all_data.append(sample)
                
                if (i + 1) % 100 == 0:
                    print(f"  Progress: {i+1}/{samples_per_class}")
        
        return all_data
    
    def _generate_normal(self):
        """Generate normal operation waveform"""
        feeder = random.choice(self.feeders)
        base_current = random.uniform(30, 60)
        base_voltage = 230
        
        # Generate time vector (4 seconds)
        t = np.linspace(0, 4, 4 * self.sampling_rate)
        
        # 3-phase currents with realistic variations
        load_var = np.random.normal(1.0, 0.05, len(t))
        
        # Add some load variation over time
        load_trend = 1 + 0.1 * np.sin(2 * np.pi * 0.1 * t)  # Slow load variation
        
        current_r = base_current * load_var * load_trend * np.sin(2*np.pi*self.fundamental_freq*t)
        current_y = base_current * load_var * load_trend * np.sin(2*np.pi*self.fundamental_freq*t - 2*np.pi/3)
        current_b = base_current * load_var * load_trend * np.sin(2*np.pi*self.fundamental_freq*t + 2*np.pi/3)
        
        # Add harmonics (typical for electrical loads)
        for h in [3, 5, 7, 9]:
            harm_amp = base_current * 0.03 / h
            current_r += harm_amp * np.sin(2*np.pi*self.fundamental_freq*h*t)
            current_y += harm_amp * np.sin(2*np.pi*self.fundamental_freq*h*t - 2*np.pi/3)
            current_b += harm_amp * np.sin(2*np.pi*self.fundamental_freq*h*t + 2*np.pi/3)
        
        # Add noise
        noise_level = 0.02
        current_r += np.random.normal(0, noise_level * base_current, len(t))
        current_y += np.random.normal(0, noise_level * base_current, len(t))
        current_b += np.random.normal(0, noise_level * base_current, len(t))
        
        # Voltages (more stable than currents)
        voltage_r = base_voltage * np.sin(2*np.pi*self.fundamental_freq*t)
        voltage_y = base_voltage * np.sin(2*np.pi*self.fundamental_freq*t - 2*np.pi/3)
        voltage_b = base_voltage * np.sin(2*np.pi*self.fundamental_freq*t + 2*np.pi/3)
        
        # Add small voltage variations
        voltage_var = np.random.normal(1.0, 0.02, len(t))
        voltage_r *= voltage_var
        voltage_y *= voltage_var
        voltage_b *= voltage_var
        
        # Downsample for storage (every 100th sample)
        downsample_factor = 100
        
        return {
            'feeder_id': feeder['id'],
            'feeder_name': feeder['name'],
            'district': feeder['district'],
            'timestamp': (datetime.now() - timedelta(days=random.randint(0, 365))).isoformat(),
            'current_r': current_r[::downsample_factor].tolist(),
            'current_y': current_y[::downsample_factor].tolist(),
            'current_b': current_b[::downsample_factor].tolist(),
            'voltage_r': voltage_r[::downsample_factor].tolist(),
            'voltage_y': voltage_y[::downsample_factor].tolist(),
            'voltage_b': voltage_b[::downsample_factor].tolist(),
            'sampling_rate': self.sampling_rate,
            'duration_seconds': 4.0,
            'area_type': feeder['area_type'],
            'typical_load_kw': feeder['typical_load_kw'],
        }
    
    def _generate_line_break(self):
        """Generate line break fault waveform"""
        sample = self._generate_normal()
        
        # Inject line break at random point (after 25% of signal)
        break_point = random.randint(len(sample['current_r']) // 4, 3 * len(sample['current_r']) // 4)
        drop_factor = random.uniform(0.1, 0.4)  # 10-40% current drop
        
        # Simulate line break by reducing current
        for phase in ['current_r', 'current_y', 'current_b']:
            sample[phase][break_point:] = [x * drop_factor for x in sample[phase][break_point:]]
        
        # Voltage also drops but less dramatically
        voltage_drop = random.uniform(0.7, 0.9)
        for phase in ['voltage_r', 'voltage_y', 'voltage_b']:
            sample[phase][break_point:] = [x * voltage_drop for x in sample[phase][break_point:]]
        
        # Add some transient effects
        transient_duration = min(50, len(sample['current_r']) - break_point)
        for i in range(transient_duration):
            if break_point + i < len(sample['current_r']):
                # Add oscillatory transient
                transient_factor = 1 + 0.3 * np.exp(-i/10) * np.sin(2*np.pi*100*i/self.sampling_rate)
                sample['current_r'][break_point + i] *= transient_factor
                sample['current_y'][break_point + i] *= transient_factor
                sample['current_b'][break_point + i] *= transient_factor
        
        sample['break_location_km'] = round(random.uniform(0.5, sample.get('feeder_length_km', 10)), 2)
        sample['fault_type'] = 'LINE_BREAK'
        
        return sample
    
    def _generate_short_circuit(self):
        """Generate short circuit fault waveform"""
        sample = self._generate_normal()
        fault_point = random.randint(len(sample['current_r']) // 4, 3 * len(sample['current_r']) // 4)
        
        # Short circuit causes massive current increase
        current_multiplier = random.uniform(5, 15)
        
        for phase in ['current_r', 'current_y', 'current_b']:
            sample[phase][fault_point:] = [x * current_multiplier for x in sample[phase][fault_point:]]
        
        # Voltage collapses during short circuit
        voltage_drop = random.uniform(0.05, 0.2)
        for phase in ['voltage_r', 'voltage_y', 'voltage_b']:
            sample[phase][fault_point:] = [x * voltage_drop for x in sample[phase][fault_point:]]
        
        # Add high-frequency transients
        for i in range(min(100, len(sample['current_r']) - fault_point)):
            if fault_point + i < len(sample['current_r']):
                # High-frequency oscillation
                hf_factor = 1 + 0.5 * np.sin(2*np.pi*1000*i/self.sampling_rate)
                sample['current_r'][fault_point + i] *= hf_factor
                sample['current_y'][fault_point + i] *= hf_factor
                sample['current_b'][fault_point + i] *= hf_factor
        
        sample['fault_type'] = 'SHORT_CIRCUIT'
        sample['fault_location_km'] = round(random.uniform(0.5, sample.get('feeder_length_km', 10)), 2)
        
        return sample
    
    def _generate_overload(self):
        """Generate overload condition waveform"""
        sample = self._generate_normal()
        overload_start = len(sample['current_r']) // 4
        
        # Gradual increase in current over time
        for i in range(overload_start, len(sample['current_r'])):
            # Gradual increase with some fluctuation
            overload_factor = 1.0 + (i - overload_start) / (len(sample['current_r']) - overload_start) * 0.8
            overload_factor += 0.1 * np.sin(2*np.pi*0.5*i/self.sampling_rate)  # Slow fluctuation
            
            sample['current_r'][i] *= overload_factor
            sample['current_y'][i] *= overload_factor
            sample['current_b'][i] *= overload_factor
        
        # Voltage drops slightly due to increased load
        voltage_drop = random.uniform(0.85, 0.95)
        for phase in ['voltage_r', 'voltage_y', 'voltage_b']:
            sample[phase][overload_start:] = [x * voltage_drop for x in sample[phase][overload_start:]]
        
        # Add more harmonics due to non-linear loads
        t = np.linspace(0, 4, len(sample['current_r']))
        for h in [3, 5, 7, 9, 11]:
            harm_amp = 0.1 * np.sin(2*np.pi*self.fundamental_freq*h*t)
            for i in range(overload_start, len(sample['current_r'])):
                sample['current_r'][i] += harm_amp[i]
                sample['current_y'][i] += harm_amp[i]
                sample['current_b'][i] += harm_amp[i]
        
        sample['fault_type'] = 'OVERLOAD'
        sample['overload_percentage'] = round(random.uniform(20, 80), 1)
        
        return sample
    
    def save_dataset(self, dataset, filename='kerala_grid_dataset.json'):
        """Save dataset to JSON file"""
        output_path = os.path.join('data', filename)
        os.makedirs('data', exist_ok=True)
        
        with open(output_path, 'w') as f:
            json.dump(dataset, f, indent=2)
        
        print(f"\n✅ Dataset saved to: {output_path}")
        print(f"Total samples: {len(dataset)}")
        
        # Print class distribution
        class_counts = {}
        for sample in dataset:
            label = sample['label']
            class_counts[label] = class_counts.get(label, 0) + 1
        
        print("\nClass distribution:")
        for class_name, count in class_counts.items():
            print(f"  {class_name}: {count} samples")
    
    def generate_features_csv(self, dataset, filename='kerala_grid_features.csv'):
        """Generate CSV file with extracted features for ML training"""
        print("\nGenerating features CSV...")
        
        features_list = []
        
        for i, sample in enumerate(dataset):
            if i % 100 == 0:
                print(f"  Processing sample {i+1}/{len(dataset)}")
            
            # Extract basic features
            features = {
                'sample_id': sample['sample_id'],
                'label': sample['label'],
                'feeder_id': sample['feeder_id'],
                'district': sample['district'],
                'area_type': sample['area_type'],
                'typical_load_kw': sample['typical_load_kw'],
            }
            
            # Calculate RMS values
            features['current_rms_r'] = np.sqrt(np.mean(np.square(sample['current_r'])))
            features['current_rms_y'] = np.sqrt(np.mean(np.square(sample['current_y'])))
            features['current_rms_b'] = np.sqrt(np.mean(np.square(sample['current_b'])))
            features['voltage_rms_r'] = np.sqrt(np.mean(np.square(sample['voltage_r'])))
            features['voltage_rms_y'] = np.sqrt(np.mean(np.square(sample['voltage_y'])))
            features['voltage_rms_b'] = np.sqrt(np.mean(np.square(sample['voltage_b'])))
            
            # Calculate peak values
            features['current_peak_r'] = np.max(np.abs(sample['current_r']))
            features['current_peak_y'] = np.max(np.abs(sample['current_y']))
            features['current_peak_b'] = np.max(np.abs(sample['current_b']))
            features['voltage_peak_r'] = np.max(np.abs(sample['voltage_r']))
            features['voltage_peak_y'] = np.max(np.abs(sample['voltage_y']))
            features['voltage_peak_b'] = np.max(np.abs(sample['voltage_b']))
            
            # Calculate current unbalance
            current_rms = [features['current_rms_r'], features['current_rms_y'], features['current_rms_b']]
            features['current_unbalance'] = (np.max(current_rms) - np.min(current_rms)) / np.max(current_rms) * 100
            
            # Calculate voltage unbalance
            voltage_rms = [features['voltage_rms_r'], features['voltage_rms_y'], features['voltage_rms_b']]
            features['voltage_unbalance'] = (np.max(voltage_rms) - np.min(voltage_rms)) / np.max(voltage_rms) * 100
            
            # Calculate current drop ratio (first 10% vs last 10%)
            first_10_percent = int(len(sample['current_r']) * 0.1)
            last_10_percent = int(len(sample['current_r']) * 0.9)
            
            initial_current = np.sqrt(np.mean(np.square(sample['current_r'][:first_10_percent])))
            final_current = np.sqrt(np.mean(np.square(sample['current_r'][last_10_percent:])))
            
            features['current_drop_ratio'] = (initial_current - final_current) / initial_current if initial_current > 0 else 0
            
            # Calculate voltage drop ratio
            initial_voltage = np.sqrt(np.mean(np.square(sample['voltage_r'][:first_10_percent])))
            final_voltage = np.sqrt(np.mean(np.square(sample['voltage_r'][last_10_percent:])))
            
            features['voltage_drop_ratio'] = (initial_voltage - final_voltage) / initial_voltage if initial_voltage > 0 else 0
            
            features_list.append(features)
        
        # Save to CSV
        df = pd.DataFrame(features_list)
        output_path = os.path.join('data', filename)
        df.to_csv(output_path, index=False)
        
        print(f"✅ Features CSV saved to: {output_path}")
        print(f"Features shape: {df.shape}")
        
        return df

def main():
    """Main function to generate dataset"""
    print("🚀 Kerala Grid Data Generator")
    print("=" * 50)
    
    # Create data directory
    os.makedirs('data', exist_ok=True)
    
    # Initialize generator
    generator = KeralaGridDataGenerator()
    
    # Generate dataset
    dataset = generator.generate_dataset(num_samples=10000)
    
    # Save dataset
    generator.save_dataset(dataset, 'kerala_grid_dataset_10k.json')
    
    # Generate features CSV for ML training
    features_df = generator.generate_features_csv(dataset, 'kerala_grid_features_10k.csv')
    
    print("\n🎉 Dataset generation complete!")
    print(f"Generated {len(dataset)} samples")
    print(f"Features: {features_df.shape[1]} columns")
    
    # Print some statistics
    print("\n📊 Dataset Statistics:")
    print(f"Districts covered: {len(set(sample['district'] for sample in dataset))}")
    print(f"Feeders: {len(set(sample['feeder_id'] for sample in dataset))}")
    print(f"Area types: {set(sample['area_type'] for sample in dataset)}")

if __name__ == '__main__':
    main()
