import { navigate } from '@reach/router';
import { toaster } from 'evergreen-ui';
import React from 'react';

import { post } from '../utils/fetchUtils';
import RecipeForm from './RecipeForm';

class CreateRecipe extends React.Component {
  handleSubmit = ({ name, sourceUrl }) => {
    post({
      endpoint: '/api/recipes',
      body: {
        recipe: {
          name,
          source_url: sourceUrl,
        },
      },
    })
      .then(json => {
        console.log(json);
        toaster.success('Created a new recipe!');
        navigate('/');
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return (
      <RecipeForm
        sectionHeading="Create a new Recipe"
        buttonText="Create"
        initialRecipe={{ name: '', sourceUrl: '' }}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

export default CreateRecipe;
