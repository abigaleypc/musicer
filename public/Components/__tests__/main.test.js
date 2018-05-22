import React from 'react';
import { shallow } from 'enzyme';

import Main from '../Main';

describe('A suite', function () {
  it('should render without throwing an error', function () {
    expect(shallow(<Main />).contains(<div className="foo">Bar</div>)).toBe(true);
  });

  // it('should be selectable by class "foo"', function () {
  //   expect(shallow(<Main />).is('.foo')).toBe(true);
  // });

  // it('should mount in a full DOM', function () {
  //   expect(mount(<Main />).find('.foo').length).toBe(1);
  // });

  // it('should render to static HTML', function () {
  //   expect(render(<Main />).text()).toEqual('Bar');
  // });
});
