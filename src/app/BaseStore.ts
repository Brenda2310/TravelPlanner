import { EntityModel } from "./hateoas/hateoas-models";

export class BaseStore{
    protected unwrapEntities<T>(pagedResponse: { _embedded?: any }): T[] {
        return ((Object.values(pagedResponse._embedded ?? {})[0] as EntityModel<T>[] | undefined) ?? [])
          .map(e => e.content ?? e) as T[];
      }
}