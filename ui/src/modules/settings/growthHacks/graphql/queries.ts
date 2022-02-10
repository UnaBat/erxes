const pipelineTemplates = `
  query pipelineTemplates($type: String!) {
    pipelineTemplates(type: $type) {
      _id
      name
      description
      stages {
        name
        formId
      }
      isDefinedByErxes
      createdAt
    }
  }
`;

const totalCount = `
  query pipelineTemplatesTotalCount {
	  pipelineTemplatesTotalCount
  }
`;

export default {
  pipelineTemplates,
  totalCount
};
