#!/usr/bin/env python3
"""
validate_data_integrity.py - Data Integrity Validation Script

Validates that data files across the project are consistent and haven't been
accidentally regenerated with auto-calculated positions.
"""

import json
import sys
from pathlib import Path
from typing import Dict, Tuple, List

# Define paths
PROJECT_ROOT = Path(__file__).parent.parent
SOURCE_DATA = PROJECT_ROOT / "data" / "escuelas.json"
PUBLIC_DATA = PROJECT_ROOT / "public" / "data" / "escuelas.json"
DOCS_DATA = PROJECT_ROOT / "docs" / "data" / "escuelas.json"

THRESHOLD = 0.01  # Minimum difference to report

def load_json_file(filepath: Path) -> Dict:
    """Load JSON data from file."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"❌ Error loading {filepath}: {e}")
        sys.exit(1)

def extract_positions(data: Dict) -> Dict[str, Tuple[float, float]]:
    """Extract positions from JSON data."""
    positions = {}
    for nodo in data.get('nodos', []):
        school_id = nodo['id']
        pos = nodo.get('posicion', {})
        if isinstance(pos, dict):
            x = pos.get('x', 0)
            y = pos.get('y', 0)
        else:
            x = nodo.get('x', 0)
            y = nodo.get('y', 0)
        positions[school_id] = (x, y)
    return positions

def compare_positions(source_pos: Dict, target_pos: Dict, 
                     target_name: str, threshold: float = THRESHOLD) -> List[str]:
    """Compare positions and return list of issues."""
    issues = []
    all_schools = set(source_pos.keys()) | set(target_pos.keys())
    
    for school_id in sorted(all_schools):
        if school_id not in source_pos:
            issues.append(f"❌ {target_name}: School '{school_id}' missing in source")
            continue
        if school_id not in target_pos:
            issues.append(f"❌ {target_name}: School '{school_id}' missing in target")
            continue
        
        source_x, source_y = source_pos[school_id]
        target_x, target_y = target_pos[school_id]
        
        x_diff = abs(source_x - target_x)
        y_diff = abs(source_y - target_y)
        
        if x_diff > threshold or y_diff > threshold:
            issues.append(
                f"⚠️  {target_name}: '{school_id}' position mismatch - "
                f"Source: ({source_x}, {source_y}) vs Target: ({target_x}, {target_y})"
            )
    
    return issues

def validate_metadata(data: Dict, filepath: Path) -> List[str]:
    """Validate metadata in JSON file."""
    issues = []
    metadata = data.get('metadata', {})
    
    if not metadata:
        issues.append(f"⚠️  {filepath.name}: No metadata found")
        return issues
    
    # Check for auto-generation markers
    if 'generated_at' in metadata:
        issues.append(
            f"⚠️  {filepath.name}: File appears to be auto-generated "
            f"(generated_at: {metadata['generated_at']})"
        )
    
    if 'generator_version' in metadata:
        issues.append(
            f"⚠️  {filepath.name}: File appears to be auto-generated "
            f"(generator_version: {metadata['generator_version']})"
        )
    
    if 'preset_name' in metadata and metadata['preset_name'] != 'base':
        issues.append(
            f"⚠️  {filepath.name}: File uses non-base preset "
            f"({metadata['preset_name']})"
        )
    
    return issues

def main():
    """Main validation function."""
    print("Data Integrity Validation")
    print("=" * 50)
    
    if not SOURCE_DATA.exists():
        print(f"ERROR: Source file not found: {SOURCE_DATA}")
        sys.exit(1)
    
    print(f"Source: {SOURCE_DATA}")
    print(f"Public: {PUBLIC_DATA}")
    print(f"Docs:   {DOCS_DATA}")
    print()
    
    # Load source data
    source_data = load_json_file(SOURCE_DATA)
    source_positions = extract_positions(source_data)
    print(f"OK: Loaded source data with {len(source_positions)} schools")
    
    all_issues = []
    
    # Validate source metadata
    print("\nValidating source metadata...")
    source_issues = validate_metadata(source_data, SOURCE_DATA)
    all_issues.extend(source_issues)
    
    # Check public data
    if PUBLIC_DATA.exists():
        print(f"\nComparing with public data...")
        public_data = load_json_file(PUBLIC_DATA)
        public_positions = extract_positions(public_data)
        
        public_issues = compare_positions(source_positions, public_positions, "public")
        all_issues.extend(public_issues)
        
        public_meta_issues = validate_metadata(public_data, PUBLIC_DATA)
        all_issues.extend(public_meta_issues)
    else:
        all_issues.append(f"ERROR: Public data file not found: {PUBLIC_DATA}")
    
    # Check docs data
    if DOCS_DATA.exists():
        print(f"\nComparing with docs data...")
        docs_data = load_json_file(DOCS_DATA)
        docs_positions = extract_positions(docs_data)
        
        docs_issues = compare_positions(source_positions, docs_positions, "docs")
        all_issues.extend(docs_issues)
        
        docs_meta_issues = validate_metadata(docs_data, DOCS_DATA)
        all_issues.extend(docs_meta_issues)
    else:
        all_issues.append(f"ERROR: Docs data file not found: {DOCS_DATA}")
    
    # Report results
    print("\n" + "=" * 50)
    print("Validation Results")
    print("=" * 50)
    
    if all_issues:
        print(f"WARNING: Found {len(all_issues)} issues:\n")
        for issue in all_issues:
            print(f"   {issue}")
        print()
        sys.exit(1)
    else:
        print("SUCCESS: All data files are consistent!")
        print("SUCCESS: No auto-generation markers detected")
        print("SUCCESS: Position data matches across all files")
        sys.exit(0)

if __name__ == "__main__":
    main()