import { Text, toaster } from 'evergreen-ui';
import { navigate } from '@reach/router';
import React from 'react';

import { get, put } from '../utils/fetchUtils';
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

    get({ endpoint: `/api/recipes/${id}` })
      .then(json => {
        const { name, sourceUrl } = json.data.attributes;
        this.setState({ loading: false, recipe: { name, sourceUrl } });
      })
      .catch(err => {
        if (err.status === 404) {
          navigate('/');
        }
      });
  }

  handleSubmit = ({ name, sourceUrl }) => {
    put({
      endpoint: `/api/recipes/${this.props.id}`,
      body: {
        recipe: {
          name,
          source_url: sourceUrl,
        },
      },
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
