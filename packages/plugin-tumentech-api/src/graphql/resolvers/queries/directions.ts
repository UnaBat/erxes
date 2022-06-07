import { IContext } from '../../../connectionResolver';
import { paginate } from '@erxes/api-utils/src';

const directionsQuery = {
  directions: async (
    _root,
    {
      searchValue,
      page,
      perPage
    }: { searchValue?: string; page?: number; perPage?: number },
    { models }: IContext
  ) => {
    const filter: any = {};

    if (searchValue) {
      filter.searchText = { $in: [new RegExp(`.*${searchValue}.*`, 'i')] };
    }

    return paginate(models.Directions.find(filter).lean(), {
      page: page || 1,
      perPage: perPage || 20
    });
  }
};

export default directionsQuery;
