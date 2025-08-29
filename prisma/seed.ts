import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Herramientas y Accesorios',
        code: 'HERRAMIENTAS',
        description: 'Herramientas prácticas y accesorios útiles para el día a día'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Tecnología y Electrónicos',
        code: 'TECNOLOGIA',
        description: 'Dispositivos electrónicos y gadgets tecnológicos'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Hogar y Oficina',
        code: 'HOGAR',
        description: 'Artículos para el hogar y oficina de alta calidad'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Textiles y Moda',
        code: 'TEXTILES',
        description: 'Prendas y accesorios textiles personalizados'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Bebidas y Alimentos',
        code: 'BEBIDAS',
        description: 'Termos, botellas y artículos relacionados con bebidas'
      }
    })
  ])

  // Create printing techniques
  const printingTechniques = await Promise.all([
    prisma.printingTechnique.create({
      data: {
        name: 'Serigrafía',
        description: 'Impresión duradera ideal para grandes cantidades',
        icon: '🎨'
      }
    }),
    prisma.printingTechnique.create({
      data: {
        name: 'Impresión Digital',
        description: 'Alta calidad para diseños complejos y fotos',
        icon: '🖨️'
      }
    }),
    prisma.printingTechnique.create({
      data: {
        name: 'Sublimación',
        description: 'Perfecto para textiles y superficies especiales',
        icon: '🌈'
      }
    }),
    prisma.printingTechnique.create({
      data: {
        name: 'Transferencia Térmica',
        description: 'Versatilidad y precisión para diseños complejos',
        icon: '🔥'
      }
    }),
    prisma.printingTechnique.create({
      data: {
        name: 'Grabado Láser',
        description: 'Elegante y permanente para metales y cristal',
        icon: '⚡'
      }
    }),
    prisma.printingTechnique.create({
      data: {
        name: 'Bordado',
        description: 'Alta calidad para prendas textiles y gorras',
        icon: '🧵'
      }
    })
  ])

  // Create featured products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Llavero Linterna LED',
        code: 'LLA-001',
        description: 'Práctico llavero con linterna LED integrada, ideal para actividades al aire libre y emergencias. Funciona con pilas de botón incluidas.',
        price: 510,
        image: '/placeholder-product.svg',
        images: JSON.stringify(['/placeholder-product.svg']),
        featured: true,
        minQuantity: 50,
        maxQuantity: 5000,
        materials: JSON.stringify(['Aluminio', 'Plástico ABS', 'LED']),
        colors: JSON.stringify(['Negro', 'Plateado', 'Azul', 'Rojo']),
        customizationInfo: 'Impresión digital o serigrafía en el cuerpo del llavero. Área de impresión: 30x20mm.',
        categoryId: categories[0].id,
        printingTechniques: {
          connect: [
            { id: printingTechniques[0].id }, // Serigrafía
            { id: printingTechniques[1].id }  // Impresión Digital
          ]
        }
      }
    }),
    prisma.product.create({
      data: {
        name: 'Credencial Personalizada',
        code: 'CRE-002',
        description: 'Credencial de alta calidad con correa personalizable. Perfecta para eventos, empresas y acceso controlado. Incluye clip metálico.',
        price: 3690,
        image: '/placeholder-product.svg',
        images: JSON.stringify(['/placeholder-product.svg']),
        featured: true,
        minQuantity: 100,
        maxQuantity: 10000,
        materials: JSON.stringify(['PVC', 'Poliestireno', 'Nylon']),
        colors: JSON.stringify(['Blanco', 'Negro', 'Azul', 'Rojo', 'Verde']),
        customizationInfo: 'Impresión a todo color en ambas caras. Opciones de acabado: mate, brillante o texturizado.',
        categoryId: categories[0].id,
        printingTechniques: {
          connect: [
            { id: printingTechniques[1].id }, // Impresión Digital
            { id: printingTechniques[2].id }  // Sublimación
          ]
        }
      }
    }),
    prisma.product.create({
      data: {
        name: 'Reloj de Pared Moderno',
        code: 'REL-003',
        description: 'Elegante reloj de pared con diseño minimalista y mecanismo silencioso. Perfecto para oficinas y espacios corporativos.',
        price: 11990,
        image: '/placeholder-product.svg',
        images: JSON.stringify(['/placeholder-product.svg']),
        featured: true,
        minQuantity: 25,
        maxQuantity: 1000,
        materials: JSON.stringify(['Aluminio', 'Acrílico', 'Mecanismo Quartz']),
        colors: JSON.stringify(['Negro', 'Blanco', 'Plateado', 'Dorado']),
        customizationInfo: 'Impresión de logo en el centro del reloj. Grabado láser disponible para marco metálico.',
        categoryId: categories[2].id,
        printingTechniques: {
          connect: [
            { id: printingTechniques[1].id }, // Impresión Digital
            { id: printingTechniques[4].id }  // Grabado Láser
          ]
        }
      }
    }),
    prisma.product.create({
      data: {
        name: 'Power Bank 10000mAh',
        code: 'PWB-004',
        description: 'Power bank de alta capacidad con doble puerto USB y indicador LED. Compatible con todos los dispositivos móviles.',
        price: 8750,
        image: '/placeholder-product.svg',
        images: JSON.stringify(['/placeholder-product.svg']),
        featured: true,
        minQuantity: 50,
        maxQuantity: 2000,
        materials: JSON.stringify(['Plástico ABS', 'Batería de Litio', 'Circuito PCB']),
        colors: JSON.stringify(['Negro', 'Blanco', 'Azul', 'Rojo']),
        customizationInfo: 'Impresión digital o serigrafía en el cuerpo. Área de impresión: 50x30mm.',
        categoryId: categories[1].id,
        printingTechniques: {
          connect: [
            { id: printingTechniques[0].id }, // Serigrafía
            { id: printingTechniques[1].id }  // Impresión Digital
          ]
        }
      }
    }),
    prisma.product.create({
      data: {
        name: 'Set de Escritorio Ejecutivo',
        code: 'SET-005',
        description: 'Elegante set de escritorio incluyendo portaplumas, posavasos y portatarjetas. Presentación en caja de regalo.',
        price: 15800,
        image: '/placeholder-product.svg',
        images: JSON.stringify(['/placeholder-product.svg']),
        featured: true,
        minQuantity: 25,
        maxQuantity: 500,
        materials: JSON.stringify(['Cuero sintético', 'Madera', 'Metal']),
        colors: JSON.stringify(['Negro', 'Marrón', 'Azul marino']),
        customizationInfo: 'Grabado láser o impresión digital en cada pieza. Presentación en caja personalizada.',
        categoryId: categories[2].id,
        printingTechniques: {
          connect: [
            { id: printingTechniques[1].id }, // Impresión Digital
            { id: printingTechniques[4].id }  // Grabado Láser
          ]
        }
      }
    }),
    prisma.product.create({
      data: {
        name: 'Chamarra Deportiva',
        code: 'CHA-006',
        description: 'Chamarra deportiva de poliéster con forro polar. Ideal para equipos deportivos y eventos corporativos al aire libre.',
        price: 22400,
        image: '/placeholder-product.svg',
        images: JSON.stringify(['/placeholder-product.svg']),
        featured: true,
        minQuantity: 20,
        maxQuantity: 1000,
        materials: JSON.stringify(['Poliéster', 'Forro polar', 'Cremallera YKK']),
        colors: JSON.stringify(['Negro', 'Azul', 'Rojo', 'Gris', 'Verde']),
        customizationInfo: 'Bordado en pecho y espalda. Impresión digital para diseños complejos.',
        categoryId: categories[3].id,
        printingTechniques: {
          connect: [
            { id: printingTechniques[1].id }, // Impresión Digital
            { id: printingTechniques[5].id }  // Bordado
          ]
        }
      }
    }),
    prisma.product.create({
      data: {
        name: 'Termo de Acero Inoxidable',
        code: 'TER-007',
        description: 'Termo de alta calidad con doble pared de acero inoxidable. Mantiene la temperatura por hasta 12 horas. Incluye tapa de seguridad.',
        price: 6800,
        image: '/placeholder-product.svg',
        images: JSON.stringify(['/placeholder-product.svg']),
        featured: true,
        minQuantity: 50,
        maxQuantity: 2000,
        materials: JSON.stringify(['Acero inoxidable 304', 'Plástico PP', 'Silicona']),
        colors: JSON.stringify(['Plateado', 'Negro', 'Azul', 'Rojo']),
        customizationInfo: 'Grabado láser o serigrafía. Área de impresión: 80x40mm.',
        categoryId: categories[4].id,
        printingTechniques: {
          connect: [
            { id: printingTechniques[0].id }, // Serigrafía
            { id: printingTechniques[4].id }  // Grabado Láser
          ]
        }
      }
    }),
    prisma.product.create({
      data: {
        name: 'Mochila Corporativa',
        code: 'MOC-008',
        description: 'Mochila resistente con múltiples compartimentos y bolsillo para laptop 15". Correas acolchadas y espalda ventilada.',
        price: 19200,
        image: '/placeholder-product.svg',
        images: JSON.stringify(['/placeholder-product.svg']),
        featured: true,
        minQuantity: 25,
        maxQuantity: 1000,
        materials: JSON.stringify(['Poliéster 600D', 'Malla transpirable', 'Cremalleras']),
        colors: JSON.stringify(['Negro', 'Azul marino', 'Gris', 'Verde']),
        customizationInfo: 'Impresión digital o bordado en el panel frontal. Área máxima: 200x150mm.',
        categoryId: categories[3].id,
        printingTechniques: {
          connect: [
            { id: printingTechniques[1].id }, // Impresión Digital
            { id: printingTechniques[5].id }  // Bordado
          ]
        }
      }
    }
    )
  ])

  console.log('Database seeded successfully!')
  console.log(`Created ${categories.length} categories`)
  console.log(`Created ${printingTechniques.length} printing techniques`)
  console.log(`Created ${products.length} products`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })