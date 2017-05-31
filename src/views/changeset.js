// @flow
import React from 'react';
import Mousetrap from 'mousetrap';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { Link } from 'react-router-dom';

import { Changeset as ChangesetDumb } from '../components/changeset';
import { Navbar } from '../components/navbar';
import { Sidebar } from '../components/sidebar';
import { Loading } from '../components/loading';
import { Verify } from '../components/changeset/verify';

import { handleChangesetModify } from '../store/changeset_actions';
import { FILTER_BINDING } from '../config/bindings';
import { dispatchEvent } from '../utils/dispatch_event';

import type { RootStateType } from '../store';

class Changeset extends React.PureComponent {
  props: {
    errorChangeset: ?Object, // error of the latest that changeset failed
    location: Object,
    loading: boolean, // loading of the selected changesetId
    currentChangeset: Map<string, *>,
    changesetId: number,
    handleChangesetModify: (number, Map<string, *>, boolean) => mixed
  };
  componentDidMount() {
    Mousetrap.bind('f', () => {
      var cmapSidebar = document.getElementsByClassName('cmap-sidebar')[0];
      if (cmapSidebar) {
        cmapSidebar.style.visibility = cmapSidebar.style.visibility === 'hidden'
          ? 'visible'
          : 'hidden';
      }
    });
  }
  showChangeset = () => {
    const {
      loading,
      errorChangeset,
      currentChangeset,
      changesetId
    } = this.props;

    if (loading || !currentChangeset) {
      return null;
    }

    if (errorChangeset) {
      dispatchEvent('showToast', {
        title: `changeset:${changesetId} failed to load`,
        content: 'Try reloading osmcha',
        timeOut: 5000,
        type: 'error'
      });
      console.error(errorChangeset);
      return null;
    }
    return (
      <ChangesetDumb
        changesetId={changesetId}
        currentChangeset={currentChangeset}
        errorChangeset={errorChangeset}
      />
    );
  };
  handleVerify = e => {
    this.props.handleChangesetModify(
      this.props.changesetId,
      this.props.currentChangeset,
      e.target.value === 'true' ? true : false // whether harmful is true or false
    );
  };
  render() {
    const width = window.innerWidth;
    return (
      <div className="flex-parent flex-parent--column bg-gray-faint clip transition border border-l--0 border--gray-light border--1">
        <Navbar
          className="bg-white color-gray border-b border--gray-light border--1 border-t--0"
          title={
            <div className="flex-parent flex-parent--row justify--space-between flex-parent--wrap">
              <span>
                {width < 800 &&
                  <Link
                    to={{ search: this.props.location.search, pathname: '/' }}
                  >
                    {'<  '}
                  </Link>}
                <span className="txt-l">
                  Changeset:
                  {' '}
                  <span className="txt-em">{this.props.changesetId}</span>
                </span>
              </span>
              <span>
                <button
                  className={'btn btn--pill btn--s color-gray btn--gray-faint'}
                >
                  <a
                    target="_blank"
                    href={`http://127.0.0.1:8111/import?url=http://www.openstreetmap.org/api/0.6/changeset/${this.props.changesetId}/download`}
                  >
                    HDYC
                  </a>
                </button>
                <button
                  className={'btn btn--pill btn--s color-gray btn--gray-faint'}
                >
                  <a target="_blank" href={'http://hdyc.neis-one.org/?'}>
                    JOSM
                  </a>
                </button>
                {this.props.currentChangeset &&
                  <Verify
                    changeset={this.props.currentChangeset}
                    placeholder="Verify"
                    onChange={this.handleVerify}
                    value="verify"
                    options={[
                      {
                        value: false,
                        display: 'Good'
                      },
                      {
                        value: true,
                        display: 'Bad'
                      }
                    ]}
                    className="select--s"
                  />}
              </span>
            </div>
          }
          buttons={
            <a
              className={`${false ? 'is-active' : ''} flex-parent-inline btn color-gray-dark color-gray-dark-on-active bg-transparent bg-darken5-on-hover bg-gray-light-on-active txt-s ml3`}
              href="#"
              onClick={() => {}}
            >
              <svg className="icon"><use xlinkHref="#icon-osm" /></svg>
            </a>
          }
        />
        <div className="flex-parent flex-parent--row justify--center transition">
          {this.showChangeset()}
        </div>
      </div>
    );
  }
}

Changeset = connect(
  (state: RootStateType, props) => ({
    changeset: state.changeset,
    location: props.location,
    changesetId: parseInt(props.match.params.id, 10),
    currentChangeset: state.changeset.getIn([
      'changesets',
      parseInt(props.match.params.id, 10)
    ]),
    errorChangeset: state.changeset.get('errorChangeset'),
    loading: state.changeset.get('loading')
  }),
  { handleChangesetModify }
)(Changeset);

export { Changeset };
