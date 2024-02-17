import { Controller, Get, Param, Render, Res } from '@nestjs/common';
import { ProductsService } from './models/products.service';
@Controller('/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('/')
  @Render('products/index')
  async index() {
    const viewData = {
      title: 'Products - Online Store',
      subtitle: 'List of products',
      products: await this.productsService.findAll(),
    };

    return { viewData };
  }

  @Get('/:id')
  async show(@Param() params, @Res() response) {
    const product = await this.productsService.findOne(params.id);
    if (product === undefined) {
      return response.redirect('/products');
    }

    const viewData = {
      title: `Online Store - ${product.name}`,
      subtitle: `Product Information - ${product.name}`,
      product: product,
    };

    return response.render('products/show', { viewData });
  }
}
