import React from 'react';
import { Button } from 'react-bootstrap';
import { addArgs, createStory } from 'utils/stories';
import WidgetListGroupItem, {
  WidgetListGroupItemProps,
} from 'components/v2/WidgetListGroupItem';

export default {
  title: 'components/v2/WidgetListGroupItem',
  component: WidgetListGroupItem,
  argTypes: {
    onClick: { action: 'clicked' },
  },
};

const Template = addArgs<WidgetListGroupItemProps>((props) => (
  <WidgetListGroupItem {...props} />
));

const baseProps = { title: 'List group item', active: false };

export const Simple = createStory(Template, { ...baseProps });

export const Active = createStory(Template, { ...baseProps, active: true });

export const ButtonWidget = createStory(Template, {
  ...baseProps,
  children: <Button size="sm">Button</Button>,
});

export const Link = createStory(Template, {
  ...baseProps,
  action: true,
  href: 'https://www.monashhumanpower.org',
});
