import { Badge, Box, Card, Flex, Grid, Heading, Progress, Text } from '@maistro/ui';

const Dashboard: React.FC = () => (
  <Flex gap="4" direction="column" className="m-4">
    <Flex gap="4" className="mb-3" justify="between" align="center" wrap="wrap">
      <Card className='w-40'>
        <Flex direction="column" align="center">
          <Text size="2" color="gray">
            Total Customers
          </Text>
          <Text size="7" weight="bold" color="green">
            2,847
          </Text>
          <Badge color="green">↗ +12% this month</Badge>
        </Flex>
      </Card>

      <Card className='w-40'>
        <Flex direction="column" align="center">
          <Text size="2" color="gray">
            Active This Month
          </Text>
          <Text size="7" weight="bold">
            1,923
          </Text>
          <Badge color="blue">67%</Badge>
        </Flex>
      </Card>

      <Card className='w-40'>
        <Flex direction="column" align="center">
          <Text size="2" color="gray">
            Avg. Retention
          </Text>
          <Text size="7" weight="bold">
            18.5
          </Text>
          <Text size="1" color="gray">
            months
          </Text>
        </Flex>
      </Card>

      <Card className='w-40'>
        <Flex direction="column" align="center">
          <Text size="2" color="gray">
            Lifetime Value
          </Text>
          <Text size="7" weight="bold">
            $1,247
          </Text>
          <Badge color="green">↗ +8%</Badge>
        </Flex>
      </Card>
    </Flex>

    <Card className="mb-6">
      <Heading size="4">Customer Lifecycle Overview</Heading>
      <Flex direction="column" gap="3">
        {[
          { stage: 'Lead', count: 1247, color: 'gray' },
          { stage: 'Prospect', count: 423, color: 'blue' },
          { stage: 'New Customer', count: 189, color: 'green' },
          { stage: 'Active Customer', count: 1923, color: 'green' },
          { stage: 'Champion', count: 156, color: 'purple' },
          { stage: 'At Risk', count: 89, color: 'orange' },
          { stage: 'Churned', count: 67, color: 'red' },
        ].map((stage) => (
          <Flex key={stage.stage} align="center" gap="4">
            <Box className="w-20">
              <Text size="2" weight="medium">
                {stage.stage}
              </Text>
            </Box>
            <Box className="flex-1">
              <Progress
                value={(stage.count / 4000) * 100}
                color={stage.color as any}
                className="h-2"
              />
            </Box>
            <Box className="w-16 text-right">
              <Text size="2" weight="bold">
                {stage.count}
              </Text>
            </Box>
          </Flex>
        ))}
      </Flex>
    </Card>
  </Flex>
);

export default Dashboard;
