/* eslint-disable */
import React from 'react';
import { Avatar, Badge, Box, Button, Card, Flex, Grid, Heading, Tabs, Text } from '@maistro/ui';
import { EnvelopeClosedIcon } from '@radix-ui/react-icons';

interface Customer {
  avatar: string;
  name: string;
  stage: string;
  email: string;
  company: string;
  phone: string;
  createdAt: string;
  lastActivity: string;
}

const customer: Customer = {
  avatar:
    'https://lh3.googleusercontent.com/a/ACg8ocJE_jO3gCtQNnJXCUX111cyWR9vO9Pp6aCyyRy4tsh-07ce6JQNjw=s96-c',
  email: 'emilia.tellez@gmail.com',
  company: 'Maistro',
  createdAt: new Date().toISOString(),
  lastActivity: new Date().toISOString(),
  name: 'Emilia Tellez',
  phone: '+44 7806705495',
  stage: 'Lead',
};

const Customer: React.FC = () => {
  return (
    <div className="m-4">
      <Card className="mb-6">
        <Flex gap="6" align="start">
          {/* Avatar & Basic Info */}
          <Flex direction="column" align="center" gap="3">
            <Avatar src={customer.avatar} fallback={customer.name.substring(0, 2)} size="5" />
            <Badge color="bronze" size="2">
              {customer.stage}
            </Badge>
          </Flex>

          {/* Customer Details */}
          <Box className="flex-1">
            <Heading size="6" className="mb-2">
              {customer.name}
            </Heading>
            <Text size="3" color="gray" className="mb-4">
              {customer.email}
            </Text>

            <Grid columns="2" gap="4">
              <Box>
                <Text size="2" color="gray">
                  Company
                </Text>
                <Text size="3" weight="medium">
                  {customer.company}
                </Text>
              </Box>
              <Box>
                <Text size="2" color="gray">
                  Phone
                </Text>
                <Text size="3">{customer.phone}</Text>
              </Box>
              <Box>
                <Text size="2" color="gray">
                  First Contact
                </Text>
                <Text size="3">{customer.createdAt}</Text>
              </Box>
              <Box>
                <Text size="2" color="gray">
                  Last Activity
                </Text>
                <Text size="3">{customer.lastActivity}</Text>
              </Box>
            </Grid>
          </Box>

          {/* Quick Actions */}
          <Flex direction="column" gap="2">
            <Button size="2">
              <EnvelopeClosedIcon />
              Send Email
            </Button>
          </Flex>
        </Flex>
      </Card>

      <Tabs.Root defaultValue="timeline">
        <Tabs.List>
          <Tabs.Trigger value="timeline">Timeline</Tabs.Trigger>
          <Tabs.Trigger value="details">Details</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="timeline">
          <Card>
            <Heading size="4">Customer Timeline</Heading>
            <Flex direction="column" gap="4">
              {/* {timeline.map((event) => (
            <TimelineEvent key={event.id} event={event} />
          ))} */}
            </Flex>
          </Card>
        </Tabs.Content>

        {/* Other tab contents */}
      </Tabs.Root>
    </div>
  );
};

export default Customer;
