import { Controller, Get, Param, Render } from '@nestjs/common';
@Controller('/products')
export class ProductsController {
  static products = [
    {
      id: '1',
      name: 'TV',
      description: 'Best tv',
      image: 'game.png',
      price: '1000',
    },
    {
      id: '2',
      name: 'iPhone',
      description: 'Best iPhone',
      image: 'safe.png',
      price: '999',
    },
    {
      id: '3',
      name: 'Chromecast',
      description: 'Best Chromecast',
      image: 'submarine.png',
      price: '30',
    },
    {
      id: '4',
      name: 'Glasses',
      description: 'Best Glasses',
      image: 'game.png',
      price: '100',
    },
  ];

  @Get('/')
  @Render('products/index')
  index() {
    const viewData = {
      title: 'Products - Online Store',
      subtitle: 'List of products',
      products: ProductsController.products,
    };

    return { viewData };
  }

  @Get('/:id')
  @Render('products/show')
  show(@Param() params) {
    const productId = params.id;
    const product = ProductsController.products[productId - 1];

    const viewData = {
      title: `${product.name} - Online Store`,
      subtitle: `${product.name} - Product Information`,
      product: product,
    };

    return {
      viewData,
    };
  }
}
