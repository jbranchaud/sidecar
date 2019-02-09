import { Text, toaster } from 'evergreen-ui';
import { navigate } from '@reach/router';
import React from 'react';

import { getAuthToken } from '../utils/authentication';
import RecipeForm from './RecipeForm';

class UpdateRecipe extends React.Component {
  state = {
    loading: true,
    recipe: {
      name: '',
      sourceUrl: '',
    },
  };

  componentDidMount() {
    const { id } = this.props;

    fetch(`/api/recipes/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: getAuthToken(),
      },
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw response.json();
        }
      })
      .then(json => {
        console.log(json);
        const { name, sourceUrl } = json.data.attributes;
        this.setState({ loading: false, recipe: { name, sourceUrl } });
      })
      .catch(err => {
        console.log(err);
        if (err.status === 404) {
          navigate('/');
        }
      });
  }

  handleSubmit = ({ name, sourceUrl }) => {
    fetch(`/api/recipes/${this.props.id}`, {
      method: 'PUT',
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
        toaster.success('Recipe updated!');
        navigate('/');
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    if (this.state.loading) {
      return <Text>Loading...</Text>;
    } else {
      return (
        <RecipeForm
          sectionHeading="Update Recipe"
          buttonText="Update"
          initialRecipe={this.state.recipe}
          onSubmit={this.handleSubmit}
        />
      );
    }
  }
}

export default UpdateRecipe;
