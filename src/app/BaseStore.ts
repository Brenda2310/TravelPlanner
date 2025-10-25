import { EntityModel } from './hateoas/hateoas-models';

export class BaseStore {
  protected unwrapEntities<T>(pagedResponse: {
    _embedded?: any;
  }): T[] {
    const embedded = pagedResponse._embedded;

    if (!embedded) {
      return [];
    }

    const entityListKey = Object.keys(embedded)[0];

    if (!entityListKey) {
      return [];
    }

    const entityModels: EntityModel<T>[] = embedded[entityListKey] || [];

    const pureDTOs = entityModels.map(
      (entityModel) => (entityModel as any).content || entityModel
    ) as T[];

    if (pureDTOs.length > 0 && typeof (pureDTOs[0] as any).active === 'boolean') {
      return (pureDTOs as any[]).filter((item) => item.active !== false) as T[];
    }
    return pureDTOs;
  }
}
