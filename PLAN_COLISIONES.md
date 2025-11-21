# Plan de Implementación: Colisiones Selectivas para Evitar Desplazamientos Globales

## Contexto del Problema (Revisado)
- El enfoque anterior aplicaba fuerzas de colisión globalmente, causando desplazamientos innecesarios en todos los nodos
- Solo 4 escuelas requieren ajustes: Marxista/Feminista (casi tocan bordes) y Austríaca/Neoclásica (superpuestas)
- El resto de nodos están suficientemente separados y no deben moverse
- Objetivo: Aplicar fuerzas de colisión selectivamente solo a nodos cercanos/superpuestos

## Análisis de Pares Conflictivos (base-zscore)
- **Marxista ↔ Feminista**: Distancia ~0.184 unidades (casi tocan bordes)
- **Austríaca ↔ Neoclásica**: Distancia ~0.051 unidades (superpuestas)
- **Otros pares**: Distancia mínima >0.15, no requieren intervención

## Enfoque Revisado: Fuerzas Selectivas
- Detectar automáticamente pares de nodos con distancia < umbral (ej: 0.15 unidades normalizadas)
- Aplicar fuerzas de colisión solo entre estos pares
- Mantener nodos lejanos en posiciones exactas (sin desplazamiento)
- Usar fuerza de repulsión mínima para separación sutil

## Parámetros Objetivo SELECTIVOS
- Umbral de detección: `0.15` unidades normalizadas
- Fuerza de colisión selectiva: `strength 0.1` (muy suave)
- Iteraciones: `1` (convergencia rápida)
- Desplazamiento esperado: `< 1px` para nodos no conflictivos, `2-3px` para pares específicos

## Pasos de Implementación

### 1. Actualizar Etiqueta del Toggle
- [ ] Cambiar texto a "(Sin colisiones)" cuando toggle esté activado
- [ ] Mantener "Permitir Colisiones" cuando desactivado
- Ubicación: `src/main.js` - event listener del toggle

### 2. Implementar Detección Selectiva de Colisiones
- [ ] Crear función `detectClosePairs()` para identificar nodos con distancia < 0.15
- [ ] Modificar `enableCollisionForces()` para aplicar fuerzas solo a pares detectados
- [ ] Usar fuerza de colisión personalizada por par en lugar de global
- Ubicación: `src/components/D3MapRenderer.js`

### 3. Modificar Simulación de Fuerzas
- [ ] Reemplazar fuerza de colisión global con fuerzas selectivas entre pares cercanos
- [ ] Mantener posicionamiento fuerte (0.4) para estabilidad
- [ ] Eliminar fuerzas de carga globales
- Ubicación: `src/components/D3MapRenderer.js` - método `enableCollisionForces()`

### 4. Agregar Logs de Depuración Selectivos
- [ ] Log solo desplazamientos de nodos en pares conflictivos
- [ ] Monitorear que nodos lejanos no se muevan (>0.1px)
- Ubicación: `src/components/D3MapRenderer.js` - en tick handler

### 5. Crear Script de Prueba con Memoria
- [ ] Script que guarda JSON de posiciones antes toggle (base-zscore sin colisiones)
- [ ] Aplica toggle y guarda posiciones finales
- [ ] Compara desplazamientos, verifica <1px para nodos no conflictivos
- Ubicación: `scripts/test_selective_collisions.js`

### 6. Ejecutar Pruebas
- [ ] Comando: `node scripts/test_selective_collisions.js`
- [ ] Validar desplazamiento <1px para 11/13 nodos
- [ ] Verificar separación adecuada para pares marxista/feminista y austriaca/neoclasica
- [ ] Confirmar no hay superposiciones

### 7. Construir y Probar
- [ ] Comando: `npm run build`
- [ ] Probar en navegador con base-zscore
- [ ] Verificar cambios visuales mínimos excepto en 4 escuelas
- [ ] Confirmar toggle funciona correctamente

### 8. Commit y Push
- [ ] Commits con mensajes descriptivos
- [ ] Push a repositorio
- [ ] Validación final

## Resultados Esperados
- **Antes**: Desplazamientos globales innecesarios
- **Después**: Solo pares conflictivos se repelen mínimamente
- **Validación**: 11 nodos sin movimiento perceptible, 4 nodos con separación sutil

## Notas Técnicas
- La detección selectiva reduce complejidad computacional
- Fuerzas personalizadas evitan sobre-corrección
- Mantiene estabilidad visual mientras resuelve conflictos específicos
- Compatible con todos los presets (no solo base-zscore)

## Validación Final
- [ ] Toggle cambia etiqueta correctamente
- [ ] Fuerzas aplicadas solo a pares cercanos
- [ ] Desplazamientos mínimos para nodos lejanos (<1px)
- [ ] Separación adecuada para pares conflictivos
- [ ] Sin superposiciones visuales
- [ ] Implementación probada y funcional