import { navigate } from '@reach/router';
import React from 'react';

import { get } from '../utils/fetchUtils';
import SectionHeading from '../components/SectionHeading';

class ShowRecipe extends React.Component {
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

  render() {
    if (this.state.loading) {
      return null;
    } else {
      return (
        <React.Fragment>
          <SectionHeading>
            {this.state.recipe.name}
          </SectionHeading>
          <a href={this.state.recipe.sourceUrl}>View recipe</a>
        </React.Fragment>
      );
    }
  }
}

export default ShowRecipe;
