"""
Example usage of Claritas AI Module
"""

from ai import ClaritasModel
import json


def example_basic():
    """Basic usage example"""
    print("=" * 60)
    print("EXAMPLE 1: Basic Audio Analysis")
    print("=" * 60)
    
    # Initialize model
    model = ClaritasModel()
    
    # Analyze audio
    result = model.predict(audio_path="ai/data/ncmmsc_1_0638.wav")
    
    # Print results
    print("\nResults:")
    print(f"  Prediction: {result['classification']['predicted_label']}")
    print(f"  Confidence: {result['classification']['confidence']:.2%}")
    print(f"  Risk Level: {result['risk_level'].upper()}")
    print(f"  Fluency Score: {result['speech_fluency_score']:.1f}/100")
    print(f"  Coherence Score: {result['lexical_coherence_score']:.1f}/100")


def example_with_transcription():
    """Example with text transcription"""
    print("\n" + "=" * 60)
    print("EXAMPLE 2: Audio + Transcription")
    print("=" * 60)
    
    model = ClaritasModel()
    
    # Sample transcription
    
    result = model.predict(
        audio_path="ai/data/ncmmsc_1_0638.wav",
        text="ai/data/ncmmsc_1_0638.txt"
    )
    
    print("\nEnhanced Results (with transcription):")
    print(f"  Prediction: {result['classification']['predicted_label']}")
    print(f"  Risk Level: {result['risk_level'].upper()}")
    print(f"  Fluency Score: {result['speech_fluency_score']:.1f}/100")
    print(f"  Coherence Score: {result['lexical_coherence_score']:.1f}/100")
    
    print("\nProbabilities:")
    for class_name, prob in result['classification']['probabilities'].items():
        print(f"  {class_name}: {prob:.2%}")


def example_detailed_features():
    """Example showing detailed features"""
    print("\n" + "=" * 60)
    print("EXAMPLE 3: Detailed Feature Analysis")
    print("=" * 60)
    
    model = ClaritasModel()
    
    result = model.predict(
        audio_path="ai/data/ncmmsc_1_0638.wav",
        text="ai/data/ncmmsc_1_0638.txt"
    )
    
    # Acoustic features
    print("\nAcoustic Features:")
    acoustic = result['fitur_akustik']
    print(f"  Pause Ratio: {acoustic['pause_ratio']:.2%}")
    print(f"  Mean Pause Duration: {acoustic['mean_pause_duration']:.2f}s")
    #print(f"  Speech Rate: {acoustic['speech_rate']:.1f} syllables/min")
    print(f"  Voice Ratio: {acoustic['voice_ratio']:.2%}")
    print(f"  Mean Pitch: {acoustic['mean_pitch']:.1f} Hz")
    
    # Lexical features
    print("\nLexical Features:")
    lexical = result['fitur_leksikal']
    print(f"  Type-Token Ratio: {lexical['ttr']:.2f}")
    print(f"  Lexical Density: {lexical['lexical_density']:.2%}")
    print(f"  Deictic Ratio: {lexical['deictic_ratio']:.2%}")
    print(f"  Repetition Ratio: {lexical['repetition_ratio']:.2%}")
    print(f"  Total Tokens: {lexical['total_tokens']}")
    print(f"  Speech Rate: {lexical['speech_rate']:.1f} syllables/min")


def example_batch_processing():
    """Example of processing multiple files"""
    print("\n" + "=" * 60)
    print("EXAMPLE 4: Batch Processing")
    print("=" * 60)
    
    model = ClaritasModel()
    
    # List of files to process
    audio_files = [
        "ai/data/adresso_0_2843.wav",
        "ai/data/adresso_2_3185.wav",
        "ai/data/ncmmsc_1_0638.wav"
    ]
    
    results = []
    
    for audio_file in audio_files:
        print(f"\nProcessing: {audio_file}")
        try:
            result = model.predict(audio_path=audio_file)
            results.append({
                'file': audio_file,
                'prediction': result['classification']['predicted_class'],
                'confidence': result['classification']['confidence'],
                'risk_level': result['risk_level'],
                'fluency_score': result['speech_fluency_score'],
                'coherence_score': result['lexical_coherence_score']
            })
            print(f"{result['classification']['predicted_class']} " +
                  f"({result['classification']['confidence']:.2%})")
        except Exception as e:
            print(f"Error: {e}")
    
    # Summary
    print("\n" + "=" * 60)
    print("BATCH SUMMARY")
    print("=" * 60)
    for r in results:
        print(f"{r['file']}: {r['prediction']} (Risk: {r['risk_level']})")


def example_feature_importance():
    """Example showing feature importance"""
    print("\n" + "=" * 60)
    print("EXAMPLE 5: Feature Importance")
    print("=" * 60)
    
    model = ClaritasModel()
    
    # Get feature importance
    importance = model.get_feature_importance()
    
    print("\nTop 10 Most Important Features:")
    for i, (feature, score) in enumerate(list(importance.items())[:10], 1):
        print(f"  {i:2d}. {feature:30s} {score:.4f}")


def example_api_response():
    """Example for API integration"""
    print("\n" + "=" * 60)
    print("EXAMPLE 6: API Response Format")
    print("=" * 60)
    
    model = ClaritasModel()
    
    result = model.predict(
        audio_path="ai/data/ncmmsc_1_0638.wav",
        text="ai/data/ncmmsc_1_0638.txt"
    )
    
    # Format for API response
    api_response = {
        'status': 'success',
        'data': {
            'prediction': {
                'class': result['classification']['predicted_class'],
                'label': result['classification']['predicted_label'],
                'confidence': result['classification']['confidence'],
                'probabilities': result['classification']['probabilities']
            },
            'scores': {
                'speech_fluency': result['speech_fluency_score'],
                'lexical_coherence': result['lexical_coherence_score']
            },
            'risk_assessment': {
                'level': result['risk_level'],
                'description': {
                    'low': 'No significant cognitive impairment detected',
                    'medium': 'Mild cognitive changes observed',
                    'high': 'Significant cognitive impairment detected'
                }[result['risk_level']]
            },
            'features': {
                'acoustic': {
                    'pause_ratio': result['fitur_akustik']['pause_ratio'],
                    'voice_ratio': result['fitur_akustik']['voice_ratio']
                },
                'lexical': {
                    'ttr': result['fitur_leksikal']['ttr'],
                    'lexical_density': result['fitur_leksikal']['lexical_density'],
                    'speech_rate': result['fitur_leksikal']['speech_rate'],
                    'repetition_ratio': result['fitur_leksikal']['total_repetitions']
                }
            }
        }
    }
    
    print("\nAPI Response (JSON):")
    print(json.dumps(api_response, indent=2))


if __name__ == "__main__":
    # Run examples
    try:
        example_basic()
        example_with_transcription()
        example_detailed_features()
        example_batch_processing()
        example_feature_importance()
        example_api_response()
        
        print("\n" + "=" * 60)
        print("All examples completed successfully!")
        print("=" * 60)
        
    except FileNotFoundError as e:
        print(f"\n❌ Error: {e}")
        print("\nℹ️  Note: Replace 'sample_audio.wav' with actual audio file paths")
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")