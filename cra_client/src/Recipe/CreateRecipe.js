import { navigate } from '@reach/router';
import { toaster } from 'evergreen-ui';
import React from 'react';

import { getAuthToken } from '../utils/authentication';
import RecipeForm from './RecipeForm';

class CreateRecipe extends React.Component {
  handleSubmit = ({ name, sourceUrl }) => {
    fetch('/api/recipes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: getAuthToken(),
      },
      body: JSON.stringify({
        recipe: {
          name,
          ['source_url']: sourceUrl,
        },
      }),
    })
      .then(response => {
        return response.json();
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
