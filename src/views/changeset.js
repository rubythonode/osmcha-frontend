// @flow
import React from 'react';
import Mousetrap from 'mousetrap';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import {connect} from 'react-redux';
import {Map} from 'immutable';

import {fetchChangeset} from '../store/changeset_actions';
import {Changeset as ChangesetDumb} from '../components/changeset';
import {Navbar} from '../components/navbar';
import {Sidebar} from '../components/sidebar';
import {Loading} from '../components/loading';
import {Filters} from '../components/filters';
import {FILTER_BINDING} from '../config/bindings';

import type {ChangesetType} from '../store/changeset_reducer';
import type {RootStateType} from '../store';

class Changeset extends React.PureComponent {
  props: {
    changeset: ChangesetType,
    paramsId: number, // is also the changesetId
    match: Object,
    fetchChangeset: (number) => mixed,
  };
  state = {
    filter: false,
  };
  constructor(props) {
    super(props);
    var changesetId = this.props.paramsId;
    if (!Number.isNaN(changesetId)) {
      this.props.fetchChangeset(changesetId);
    }
  }
  componentDidMount() {
    Mousetrap.bind(FILTER_BINDING, () => {
      this.toggleFilter();
    });
    Mousetrap.bind('f', () => {
      var cmapSidebar = document.getElementsByClassName('cmap-sidebar')[0];
      if (cmapSidebar) {
        cmapSidebar.style.visibility = cmapSidebar.style.visibility === 'hidden'
          ? 'visible'
          : 'hidden';
      }
    });
  }
  componentWillReceiveProps(nextProps) {
    var newId = nextProps.paramsId;
    var oldId = this.props.paramsId;
    if (Number.isNaN(newId)) {
      return;
    }
    if (newId !== oldId) {
      this.props.fetchChangeset(newId);
    }
  }
  showChangeset = () => {
    const {match, changeset} = this.props;
    const currentChangeset: Map<string, *> = changeset.get('currentChangeset');
    const currentChangesetMap: Object = changeset.get('currentChangesetMap');
    if (changeset.get('loading')) {
      return <Loading />;
    }
    if (match.path !== '/changesets/:id' || !this.props.paramsId) {
      return <div> batpad, please select a changeset </div>;
    }
    return (
      <ChangesetDumb
        changesetId={this.props.paramsId}
        currentChangeset={currentChangeset}
        errorChangeset={changeset.get('errorChangeset')}
        errorChangesetMap={changeset.get('errorChangesetMap')}
        currentChangesetMap={currentChangesetMap}
        scrollUp={this.scrollUp}
        scrollDown={this.scrollDown}
      />
    );
  };
  toggleFilter = () => {
    this.setState({
      filter: !this.state.filter,
    });
  };
  scrollDown = () => {
    if (this.scrollable) {
      window.s = this.scrollable;
      this.scrollable.scrollTop = window.innerHeight;
    }
  };
  scrollUp = () => {
    if (this.scrollable) {
      this.scrollable.scrollTop = 0;
    }
  };
  scrollable = null;
  render() {
    return (
      <div
        className="flex-parent flex-parent--column bg-gray-faint clip transition"
      >
        <Navbar
          className="bg-white color-gray border-b border--gray-light border--1"
          title={
            <div
              className="flex-parent flex-parent--row justify--space-between flex-parent--wrap"
            >
              <span className="txt-l">
                Changeset: <span className="txt-em">{this.props.paramsId}</span>
              </span>
              <span>

                <button
                  className={`btn btn--pill btn--s color-gray btn--gray-faint`}
                >
                  <a
                    target="_blank"
                    href={
                      `http://127.0.0.1:8111/import?url=http://www.openstreetmap.org/api/0.6/changeset/${this.props.paramsId}/download`
                    }
                  >
                    HDYC
                  </a>
                </button>
                <button
                  className={`btn btn--pill btn--s color-gray btn--gray-faint`}
                >
                  <a target="_blank" href={`http://hdyc.neis-one.org/?`}>
                    JOSM
                  </a>
                </button>
                <button
                  className={`btn btn--pill btn--s color-gray btn--gray-faint`}
                >
                  <a target="_blank" href={`http://hdyc.neis-one.org/?`}>
                    Verify
                  </a>
                </button>
              </span>

            </div>
          }
          buttons={
            <a
              className={
                `${this.state.filter ? 'is-active' : ''} flex-parent-inline btn color-gray-dark color-gray-dark-on-active bg-transparent bg-darken5-on-hover bg-gray-light-on-active txt-s ml3`
              }
              href="#"
              onClick={this.toggleFilter}
            >
              <svg className="icon"><use xlinkHref="#icon-osm" /></svg>
            </a>
          }
        />
        <div
          className="flex-parent flex-parent--row justify--center scroll-auto transition"
          ref={r => this.scrollable = r}
          style={{
            height: false ? window.innerHeight : window.innerHeight - 55,
          }}
        >
          {this.showChangeset()}
          <CSSTransitionGroup
            transitionName="filters-bar"
            transitionEnterTimeout={300}
            transitionLeaveTimeout={400}
          >
            {this.state.filter
              ? <Sidebar
                  key={0}
                  className="transition 480 wmin480 absolute bottom right z6 h-full"
                  title={
                    <Navbar
                      title={
                        <span
                          className="flex-parent flex-parent--center-cross justify--space-between txt-fancy color-gray txt-l"
                        >
                          <span className="txt-bold select-none">Filters</span>
                          <span className="flex-child flex-child--grow" />
                          <a
                            className={
                              `flex-parent-inline btn color-white bg-transparent bg-gray-on-hover ml3`
                            }
                            href="#"
                            onClick={this.toggleFilter}
                          >
                            <svg className="icon">
                              <use xlinkHref="#icon-close" />
                            </svg>
                          </a>
                        </span>
                      }
                    />
                  }
                >
                  <Filters />
                </Sidebar>
              : null}
          </CSSTransitionGroup>
        </div>
      </div>
    );
  }
}

Changeset = connect(
  (state: RootStateType, props) => ({
    changeset: state.changeset,
    paramsId: parseInt(props.match.params.id, 10),
  }),
  {fetchChangeset},
)(Changeset);

export {Changeset};
