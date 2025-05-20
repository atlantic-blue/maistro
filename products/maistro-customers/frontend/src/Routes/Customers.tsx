import { Box, Button, Card, DropdownMenu, Flex, IconButton, Select, Table, TextField, Text, Avatar, Badge } from "@maistro/ui"
import { DotsHorizontalIcon, MagnifyingGlassIcon, PlusIcon } from "@radix-ui/react-icons"
import { useNavigate } from "react-router";
import { appRoutes } from "./appRoutes";

interface Customer {
    id: string
    avatar: string
    name: string
    email: string
    stage: string
    source: string
    lastActivity: string
    value: string
    retentionMonths: string
}
const customers: Customer[] = [
    {
        id: "1",
        avatar: "",
        email: "emilia.tellez@gmail.com",
        name: "Emilia Tellez",
        retentionMonths: "14",
        source: "Maistro Websites",
        lastActivity: new Date().toISOString(),
        stage: "lead",
        value: "100",
    },
    {
        id: "2",
        avatar: "",
        email: "emilia.tellez@gmail.com",
        name: "Emilia Tellez",
        retentionMonths: "14",
        source: "Maistro Websites",
        lastActivity: new Date().toISOString(),
        stage: "lead",
        value: "100",
    },
    {
        id: "3",
        avatar: "",
        email: "emilia.tellez@gmail.com",
        name: "Emilia Tellez",
        retentionMonths: "14",
        source: "Maistro Websites",
        lastActivity: new Date().toISOString(),
        stage: "lead",
        value: "100",
    }
]

const getStageColor = (stage: string) => {
    return "gold"
}

const Customers: React.FC = () => {
    const navigate = useNavigate()

    return (
        <div className="m-4">
            <Card className="mb-4">
    <Flex gap="4" align="center" wrap="wrap">
      {/* Search */}
      <Box className="flex-1 min-w-64">
        <TextField.Root placeholder="Search customers...">
          <TextField.Slot>
            <MagnifyingGlassIcon />
          </TextField.Slot>
        </TextField.Root>
      </Box>
      
      {/* Lifecycle Stage Filter */}
      <Select.Root defaultValue="all">
        <Select.Trigger className="w-40">
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="all">All Stages</Select.Item>
          <Select.Item value="lead">Lead</Select.Item>
          <Select.Item value="prospect">Prospect</Select.Item>
          <Select.Item value="customer">Customer</Select.Item>
          <Select.Item value="champion">Champion</Select.Item>
        </Select.Content>
      </Select.Root>
      
      {/* Source Filter */}
      <Select.Root defaultValue="all">
        <Select.Trigger className="w-40">
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="all">All Sources</Select.Item>
          <Select.Item value="website">Website</Select.Item>
          <Select.Item value="funnel">Funnel</Select.Item>
          <Select.Item value="social">Social</Select.Item>
          <Select.Item value="referral">Referral</Select.Item>
        </Select.Content>
      </Select.Root>
      
      {/* Add Customer Button */}
      <Button color="green">
        <PlusIcon />
        Add Customer
      </Button>
    </Flex>
    </Card>

    <Card>
  <Table.Root>
    <Table.Header>
      <Table.Row>
        <Table.ColumnHeaderCell>Customer</Table.ColumnHeaderCell>
        <Table.ColumnHeaderCell>Stage</Table.ColumnHeaderCell>
        <Table.ColumnHeaderCell>Source</Table.ColumnHeaderCell>
        <Table.ColumnHeaderCell>Last Activity</Table.ColumnHeaderCell>
        <Table.ColumnHeaderCell>Value</Table.ColumnHeaderCell>
        <Table.ColumnHeaderCell>Retention</Table.ColumnHeaderCell>
        <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {customers.map((customer) => (
        <Table.Row key={customer.id}>
          <Table.RowHeaderCell>
            <Flex align="center" gap="3">
              <Avatar
                src={customer.avatar}
                fallback={customer.name.substring(0, 2)}
                size="2"
              />
              <Box>
                <Text weight="medium">{customer.name}</Text>
                <Text size="2" color="gray">{customer.email}</Text>
              </Box>
            </Flex>
          </Table.RowHeaderCell>
          
          <Table.Cell>
            <Badge color="cyan">
              {customer.stage}
            </Badge>
          </Table.Cell>
          
          <Table.Cell>
            <Flex align="center" gap="2">
              {/* {getSourceIcon(customer.source)} */}
              <Text size="2">{customer.source}</Text>
            </Flex>
          </Table.Cell>
          
          <Table.Cell>
            <Text size="2" color="gray">
                {customer.lastActivity}
              {/* {formatRelativeTime(customer.lastActivity)} */}
            </Text>
          </Table.Cell>
          
          <Table.Cell>
            <Text weight="medium">${customer.value}</Text>
          </Table.Cell>
          
          <Table.Cell>
            <Text size="2">
              {customer.retentionMonths} months
            </Text>
          </Table.Cell>
          
          <Table.Cell>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <IconButton variant="ghost" size="1">
                  <DotsHorizontalIcon />
                </IconButton>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Item
                    onClick={() => {
                        navigate(appRoutes.getCustomer(customer.id))
                    }}
                >View Details</DropdownMenu.Item>
                <DropdownMenu.Item>Edit Customer</DropdownMenu.Item>
                <DropdownMenu.Item>View Timeline</DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item color="red">
                  Delete Customer
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table.Root>
</Card>
        </div>
    )
}

export default Customers
