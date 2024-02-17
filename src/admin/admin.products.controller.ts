import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Redirect,
  Render,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from '../models/products.service';
import { CreateProductDto } from '../models/product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductValidator } from '../validators/product.validator';
import * as fs from 'fs';

@Controller('/admin/products')
export class AdminProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('/') @Render('admin/products/index') async index() {
    const viewData = [];
    viewData['title'] = 'Admin Page - Admin - Online Store';
    viewData['products'] = await this.productsService.findAll();
    return {
      viewData,
    };
  }

  @Post('/store')
  @UseInterceptors(FileInterceptor('image', { dest: './public/uploads' }))
  @Redirect('/admin/products')
  async store(
    @Body() product: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() request,
  ): Promise<void> {
    const toValidate: string[] = [
      'name',
      'description',
      'price',
      'imageCreate',
    ];
    const errors: string[] = ProductValidator.validate(
      product,
      file,
      toValidate,
    );

    if (errors.length > 0) {
      if (file) {
        fs.unlinkSync(file.path);
      }
      request.session.flashErrors = errors;
    } else {
      const newProduct = {
        image: file.filename,
        description: product.description,
        name: product.name,
        price: Number(product.price),
      };
      await this.productsService.createOrUpdate(newProduct);
    }
  }

  @Post('/:id')
  @Redirect('/admin/products')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @Get('/:id')
  @Render('admin/products/edit')
  async edit(@Param('id') id: string) {
    const viewData = [];
    viewData['title'] = 'Admin Page - Edit Product - Online Store';
    viewData['product'] = await this.productsService.findOne(id);
    return {
      viewData: viewData,
    };
  }

  @Post('/:id/update')
  @UseInterceptors(FileInterceptor('image', { dest: './public/uploads' }))
  @Redirect('/admin/products')
  async update(
    @Body() body,
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
  ) {
    const product = await this.productsService.findOne(id);
    const newProduct = {
      description: product.description,
      name: product.name,
      price: Number(product.price),
    };

    if (file) {
      //newProduct.image = file.filename;
    }

    await this.productsService.createOrUpdate(product);
  }
}
