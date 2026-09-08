import { EntityModel } from './hateoas/hateoas-models';

export class BaseStore {
  protected unwrapEntities<T>(pagedResponse: { _embedded?: any }): T[] {
    const embedded = pagedResponse._embedded;

    if (!embedded) {
      return [];
    }

    const entityListKey = Object.keys(embedded)[0];

    if (!entityListKey) {
      return [];
    }

    const entityModels: EntityModel<T>[] = embedded[entityListKey] || [];

    return entityModels.map(
      entityModel => (entityModel as any).content || entityModel
    ) as T[];
  }
}
