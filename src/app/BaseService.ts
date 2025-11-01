import { HttpParams } from '@angular/common/http';
import { Pageable } from './hateoas/hateoas-models';

export class BaseService{
    protected buildParams(pageable: Pageable, filters: any = {}): HttpParams {
    let params = new HttpParams()
      .set('page', pageable.page.toString())
      .set('size', pageable.size.toString());

    if (pageable.sort) {
      params = params.set('sort', pageable.sort);
    }

    for (const key in filters) {
      const value = filters[key];
        if (value !== undefined && value !== null && value !== '') { 
            params = params.set(key, value.toString());
        }
    }
    return params;
  }
}