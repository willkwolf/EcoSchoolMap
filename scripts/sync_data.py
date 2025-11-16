#!/usr/bin/env python3
"""
sync_data.py - Data Synchronization Script

Ensures data integrity by syncing the source of truth (data/escuelas.json) 
to public/ and docs/ directories before builds.

This prevents auto-generated data from overwriting manually edited positions.
"""

import json
import shutil
import sys
from pathlib import Path
from typing import Dict, Tuple

# Define paths
PROJECT_ROOT = Path(__file__).parent.parent
SOURCE_DATA = PROJECT_ROOT / "data" / "escuelas.json"
PUBLIC_DATA = PROJECT_ROOT / "public" / "data" / "escuelas.json"
DOCS_DATA = PROJECT_ROOT / "docs" / "data" / "escuelas.json"

def load_json_file(filepath: Path) -> Dict:
    """Load JSON data from file."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading {filepath}: {e}")
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

def compare_positions(pos1: Dict, pos2: Dict, threshold: float = 0.01) -> Dict[str, Tuple]:
    """Compare two position dictionaries and return differences."""
    differences = {}
    all_schools = set(pos1.keys()) | set(pos2.keys())
    
    for school_id in all_schools:
        p1 = pos1.get(school_id)
        p2 = pos2.get(school_id)
        
        if p1 is None or p2 is None:
            continue
            
        x1, y1 = p1
        x2, y2 = p2
        
        if abs(x1 - x2) > threshold or abs(y1 - y2) > threshold:
            differences[school_id] = (p1, p2)
    
    return differences

def sync_file(source: Path, destination: Path, description: str) -> bool:
    """Sync source file to destination."""
    try:
        if not destination.parent.exists():
            destination.parent.mkdir(parents=True, exist_ok=True)
        
        # Load both files to compare
        source_data = load_json_file(source)
        dest_data = load_json_file(destination) if destination.exists() else None
        
        if dest_data:
            source_pos = extract_positions(source_data)
            dest_pos = extract_positions(dest_data)
            differences = compare_positions(source_pos, dest_pos)
            
            if differences:
                print(f"Warning {description}: Found {len(differences)} position differences:")
                for school_id, (source_pos, dest_pos) in differences.items():
                    print(f"   • {school_id}: {dest_pos} → {source_pos}")
            else:
                print(f"OK {description}: No significant differences found")

        # Copy file
        shutil.copy2(source, destination)
        print(f"OK {description}: Synced successfully")
        return True

    except Exception as e:
        print(f"Error {description}: Error syncing - {e}")
        return False

def main():
    """Main sync function."""
    print("Data Synchronization Script")
    print("=" * 50)
    
    if not SOURCE_DATA.exists():
        print(f"Error: Source file not found: {SOURCE_DATA}")
        sys.exit(1)
    
    print(f"Source: {SOURCE_DATA}")
    print(f"Public: {PUBLIC_DATA}")
    print(f"Docs:   {DOCS_DATA}")
    print()
    
    # Sync to public
    success1 = sync_file(SOURCE_DATA, PUBLIC_DATA, "Public data")
    
    # Sync to docs
    success2 = sync_file(SOURCE_DATA, DOCS_DATA, "Docs data")
    
    print()
    if success1 and success2:
        print("Sync completed successfully!")
        sys.exit(0)
    else:
        print("Sync completed with errors")
        sys.exit(1)

if __name__ == "__main__":
    main()