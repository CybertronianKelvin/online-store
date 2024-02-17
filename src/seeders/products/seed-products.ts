import { Test } from '@nestjs/testing';
import * as fs from 'fs';
import * as csvParser from 'csv-parser';
import { PrismaService } from '../../prisma.service'; // Import your PrismaService
import { AppModule } from '../../app.module';

(async () => {
  try {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = moduleRef.createNestApplication();
    await app.init();

    const prismaService = app.get(PrismaService);

    const filePath = './src/seeders/products/products.csv'; // Provide the path to your CSV file

    const products = [];

    // Read the CSV file and create products array
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (data) => {
        products.push(data);
      })
      .on('end', async () => {
        // Insert products into the database using PrismaService
        for (const product of products) {
          await prismaService.product.create({
            data: {
              name: product.name,
              description: product.description,
              image: product.image,
              price: parseFloat(product.price), // Convert price to float if necessary
            },
          });
        }

        console.log('Product data seeded successfully');
        await app.close();
      });
  } catch (error) {
    console.error('Error seeding product data:', error);
  }
})();
