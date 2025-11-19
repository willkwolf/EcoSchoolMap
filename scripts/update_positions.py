#!/usr/bin/env python3
"""
update_positions.py - Update positions in data/escuelas.json from base-percentile variant
"""

import json

# Load base percentile
with open('data/variants/base-percentile.json', 'r', encoding='utf-8') as f:
    base_data = json.load(f)

# Load original
with open('data/escuelas.json', 'r', encoding='utf-8') as f:
    original_data = json.load(f)

# Create position map from base
positions = {}
for nodo in base_data['nodos']:
    positions[nodo['id']] = nodo['posicion']

# Update positions in original
for nodo in original_data['nodos']:
    if nodo['id'] in positions:
        nodo['posicion'] = positions[nodo['id']]

# Save
with open('data/escuelas.json', 'w', encoding='utf-8') as f:
    json.dump(original_data, f, ensure_ascii=False, indent=2)

print("Positions updated from base-percentile to data/escuelas.json")