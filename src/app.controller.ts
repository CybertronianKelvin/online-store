import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Render('index')
  index() {}

  @Get('/about')
  @Render('about')
  about() {
    const viewData = {
      title: 'About us - Online Store',
      subtitle: 'About us',
      description: 'This is an about page ...',
      author: 'Developed by: Your Name',
    };

    return {
      viewData,
    };
  }
}
