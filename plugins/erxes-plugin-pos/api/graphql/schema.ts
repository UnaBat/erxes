export const types = `
    type Pos {
        _id: String
        name: String
        description: String
        createdAt: Date
    }


    type ProductGroups {
        _id: String
        name: String
        description: String
    }
`;

export const queries = `
    allPos: [Pos]
`;

export const mutations = `
  posAdd(
    name: String
    description: String
  ): Pos

  posEdit(
    _id: String
    name: String
    description: String
  ): Pos

  posRemove(_id: String!): JSON
`;