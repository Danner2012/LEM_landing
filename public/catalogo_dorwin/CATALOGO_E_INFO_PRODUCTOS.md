# Catálogo Maestro e Información Técnica Extraída — DORWIN Colchões (LEM)

Este documento reúne **toda la información técnica, precios, sucursales y familias de modelos** extraída de las **165 piezas multimedia** (164 imágenes + 1 video de showroom) y cruzada con la base de datos de `LEM_backend` (`populate_inventory.py`).

---

## 1. Datos de la Empresa, Sucursales y Contacto (Extraído de Volantes y Letreros)

- **Marca Principal:** `DORWIN® colchões` (Importadora Hogarelax / Relax Muebles y Colchones)
- **Certificaciones visibles en etiquetas:** `ISO 9001 Qualidade Certificada`, `ISPA`, `Active Protection`, `Technology Germany (Telas Frías)`
- **Teléfonos / WhatsApp de Ventas (para conectar con n8n y botones de cotización):**
  - Principal (Feria / Gigantografías): **`+591 69866371`** y **`+591 62810698`**
  - Secundarios (Tienda): **`+591 62099933`** y **`+591 65648595`**
- **Sucursales Oficiales (extraídas del volante del video `165`):**
  1. **El Alto:** Calle Nistaus #100, casi esq. Pancho, Zona 16 de Julio.
  2. **Potosí:** Mercado Uyuni, Zona San Roque, C/ San Alberto entre Boquerón y Junín #210.
  3. **Oruro:** Calle Sucre entre Velasco y Pagador #260.
  4. **Santa Cruz:** 4to. Anillo entre Doble Vía La Guardia y Nuevo Mercado Abasto.

---

## 2. Fichas Técnicas Oficiales de Colchones (`01_fichas_tecnicas_colchones/`)

| Archivo | Modelo | Garantía | Soporte por Persona | Núcleo / Resortes | Espuma y Estructura | Tela y Altura | Sensación / Salud | Precios Base en BD (`Bs.`) |
| :--- | :--- | :---: | :---: | :--- | :--- | :--- | :--- | :--- |
| `001_ficha_zero_stress...` | **Zero Stress** (*Zero*) | 5 años | **130 kg** | Resorte PHP Reforzado | Espuma **D35** + Láminas y marco encajonado con espuma **Cazata** | Tela 100% algodón (Gris/Negro) • **Altura 29 cm** | **Firme / Ortopédica** | 2P: **Bs. 2,300**<br>2½P: **Bs. 2,550** |
| `002_ficha_casata_pedic...` | **Casata Pedic** | 8 años | **160 kg** | Resorte PHP **Pocket** | Espuma **D40** + Láminas y marco encajonado con espuma **Cazata** | Tela acolchada con espuma 100% algodón • **Altura 34 cm** | **Extra Firme / Ortopédica** (Cuidado lumbar máximo) | 2P: **Bs. 3,880**<br>2½P: *Consultar / ~Bs. 4,200* |
| `003_ficha_smart_viscogel...` | **Smart Viscogel** (*Visco Gel*) | 6 años | **120 kg** | Resorte PHP **Pocket** | **Espuma Viscogel** + Marco de espuma **Cazata** | Tela 100% algodón / Telas frescas (Mayor transpirabilidad) | **Suave / Adaptable** (Frescura en cada noche) | 2½P: **Bs. 4,200** |
| `004_ficha_pocket_cool...` | **Pocket Cool** *(Ed. Limitada)* | 8 años | **130 kg** | Resorte PHP **Pocket** | Espuma **D40** + Marco encajonado con espuma **Cazata** | Tela 100% algodón / Telas frescas (Vivo celeste/turquesa) | **Ortopédica Fresca** | *Edición Limitada* |
| `005_ficha_relax...` | **Relax** | 5 años | **120 kg** | Resorte PHP Reforzado | Espuma **D30** + Marco encajonado con espuma **HR** (Pillow Top) | Tela 100% algodón | **Anatómica** | 1½P: **Bs. 1,470**<br>2½P: **Bs. 2,280** |
| `006_ficha_naturfresh...` | **Naturfresh** (*Natur Fresh*) | 6 años | **140 kg** | Resorte PHP Reforzado | Espuma **D40** + Marco sellado con espuma **HR** (Pillow Top) | Tela 100% algodón • **Tecnología Alemana de Telas Frías** | **Ortopédica Termorreguladora** | 1½P: **Bs. 2,080**<br>2P: **Bs. 2,680**<br>2½P: **Bs. 3,080** |
| `007_ficha_classic...` | **Classic** | 3 años | **90 kg** | Resortes **Bonell** | Espuma **D25** | Tela 100% algodón | **Semi Firme** | 1P: **Bs. 1,060**<br>2P: **Bs. 1,550**<br>2½P: **Bs. 1,860**<br>3P: **Bs. 1,930** |
| `008_ficha_bamboo_confort_real...` | **Bamboo / Confort Real** | 5 años | **130 kg** | Resorte Reforzado | Espuma **D35** + Espuma **Cazata** interna | Tela 100% algodón (Banda *CONFORT REAL* / Fibra Bambú) | **Ortopédica Antiácaros** | 1½P: **Bs. 1,580**<br>2P: **Bs. 2,150**<br>2½P: **Bs. 2,460**<br>3P: **Bs. 2,890** |

> **Otros colchones detectados en las fotos de tienda y BD:**
> - **Celta Ángelus Pocket (Origen Chileno):** Imágenes `023`, `109` y video `165` (Precios BD: 2P **Bs. 1,600** | 2½P **Bs. 1,850** | 3P **Bs. 2,100**).
> - **Dorwin Pocket Express:** Imágenes `038`, `039`, `064`.
> - **Sonho Bom:** Imagen `036`.

---

## 3. Información de Espumas, Almohadas y Accesorios (`02_info_espumas_y_almohadas/`)

- **Muestrario físico de densidades de espuma (`100_muestras_espuma...`):**
  - Bloques de poliuretano etiquetados: **`D12`**, **`D19`**, **`D40`** y **`SOFT`** (más las densidades `D25`, `D30`, `D35`, `HR`, `Cazata` y `Viscogel` de las fichas).
- **Almohadas (`100`, `101`, `105`, `108` y video `165`):**
  1. **Almohada DORWIN Original (`50 x 70 cm`):** Tejido en matelassê, soporte firme, suave y confortable, mayor vida útil.
  2. **Almohada Celta Viscoelástica:** Espuma viscoelástica con memoria ergonómica cervical.
  3. **Almohada PARE / Movelpro (`50 x 70 cm`):** Tecnología brasilera, tela 100% poliéster, relleno 100% fibra de poliéster siliconada.
  4. **Almohada NASAX y Látex Gel:** Visibles en exhibición (`027` y video `165`).
- **Puffs Deportivos e Infantiles (Video `165`):**
  - Diseños en ecocuero: **FC Barcelona (FCB)**, **Bola 8 de Billar**, **Chimuelo (Dragón)** y **Sonic**.

---

## 4. Estructura de Carpetas por Modelos de Espaldares y Juegos de Cama

Todas las **165 piezas + el logo oficial** fueron organizadas y renombradas descriptivamente dentro de `LEM_landing/public/catalogo_dorwin/`:

1. **`00_marca_y_showroom/` (2 archivos)**
   - Logo oficial DORWIN (`000_logo_oficial_dorwin_colchoes.jpg`) y video del showroom (`165_video_showroom...mp4`).
2. **`01_fichas_tecnicas_colchones/` (8 archivos)**
   - Las 8 fichas técnicas oficiales de colchones DORWIN listadas en la Tabla 2.
3. **`02_info_espumas_y_almohadas/` (4 archivos)**
   - Muestrario de densidades de espuma (`D12`, `D19`, `D40`, `SOFT`) y empaques/especificaciones de almohadas.
4. **`03_camas_imperiales_veladores_led/` (42 archivos en 5 subcarpetas por modelo)**
   - **`A_columnas_escalonadas_en_V_dorado_espejo/` (18 fotos):** El modelo estrella de DORWIN. Columnas verticales con franjas doradas o plateadas escalonadas en "V", luces LED, enchufes y 2 veladores integrados. Disponible en: *Negro, Azul Petróleo, Marrón Chocolate, Gris Plomo, Gris Ceniza, Rosa Viejo, Beige Crema, Blanco Marfil y Bicolor*.
   - **`B_chevron_V_central_espejo/` (5 fotos):** Espaldar imperial ancho con "V" central en relieve, franjas horizontales laterales con espejo y veladores de 3 cajones (*Beige Visón, Rosa Viejo, Verde Oliva Ceniza*).
   - **`C_rombo_central_geometrico/` (4 fotos):** Espaldar imperial con gran rombo central y triángulos concéntricos + veladores (*Gris Plomo, Negro*).
   - **`D_laterales_madera_alistonada_WPC/` (5 fotos):** Modelos modernos con marco lateral de madera alistonada (WPC), lámparas colgantes e interior geométrico con listones dorados (*Negro, Rosa Viejo, Degradé Gris/Beige*).
   - **`E_otros_imperiales_especiales/` (10 fotos):** Modelos imperiales con nicho de mármol LED (`071`), corazón LED (`015`), abanico LED dorado (`016`), ondas 3D (`094`), bloques abullonados (`079`), melamina wengué (`043`), etc.
5. **`04_espaldares_sol_naciente_y_abanico/` (16 archivos)**
   - Familia de espaldares con semicírculo central inferior y rayos/pétalos radiales hacia arriba (*Sol Naciente*, *Abanico Diagonal* y *Concha Marina Festoneada*). Colores: *Blanco Humo, Marfil, Beige Champán, Rosa Pastel, Bicolor Rosa/Fucsia, Bicolor Chocolate/Beige, Marrón Café, Gris Plomo, Gris Grafito*.
6. **`05_espaldares_capitone_rombos_botones/` (11 archivos)**
   - Clásico acolchado capitoné de rombos con botones forrados o botones de cristal/strass, con o sin marco perimetral, e incluso con tarima y piecera haciendo juego (`161`). Colores: *Crema, Beige, Blanco Jacquard, Gris Perla, Rosa Palo, Azul Marino/Noche, Marrón Café, Negro con Dorado*.
7. **`06_espaldares_chevron_espiga_y_cortes_en_V/` (16 archivos)**
   - Diseños de espiga/chevron apuntando hacia arriba o abajo, con o sin apliques dorados/espejo. Colores: *Marrón Chocolate, Topo, Beige Arena, Crema Marfil, Gris Claro, Verde Oliva/Salvia, Naranja Terracota, Azul Marino, Bicolor Gris/Negro, Tricolor Café/Blanco/Beige*.
8. **`07_espaldares_paneles_verticales_y_ondas/` (15 archivos)**
   - Bastones verticales clásicos (de 4, 6, 7 y 10 columnas), paneles verticales con cortes curvos dorados/LED (`076`, `128`, `150`) y camas estilo "Nube / Bouclé" con bordes acolchados gruesos (`070`, `080`, `084`).
9. **`08_espaldares_bloques_ladrillo_y_cuadricula/` (26 archivos en 2 subcarpetas)**
   - **`A_trenzado_ladrillo_entrelazado/` (16 fotos):** Bloques verticales y horizontales intercalados tipo trenza/cesta o ladrillo, y diseño ajedrez bicolor (`137`, `138`).
   - **`B_cuadricula_cuadros_y_baul/` (10 fotos):** Cuadrículas simétricas (2x3, 2x4, 2x6, 4x3 con botones) y bases somier tipo **Baúl con agarraderas** (`020`, `040`).
10. **`09_espaldares_geometricos_hexagonales_y_especiales/` (25 archivos)**
    - Panal hexagonal (`009`, `095`), reloj de arena / corbatín (`110`, `147`, `156`), sobre doble en X (`114`), listones dorados en X (`038`), envolvente en L bicolor blanco/vino (`149`) y diseño infantil Flor con veladores (`021`).
