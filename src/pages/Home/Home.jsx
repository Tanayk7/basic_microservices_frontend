import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';
import Layout from '../../Components/Layout/Layout';
import { Table, Typography, Divider, Button, Input, Tag, notification, Popconfirm } from 'antd';
import { SearchOutlined, EditOutlined, ExportOutlined, RestOutlined } from '@ant-design/icons';
import { CSVLink } from 'react-csv'
import { formatDate } from '../../utils/datetime';
import FuzzySearch from "fuzzy-search";
import apis from '../../lib/apis';

const { Title } = Typography;

const columns = [
	{
		title: "id",
		dataIndex: "id",
		sorter: (a,b) => a.id - b.id
	},
    {    
        title: 'Full Name',
        dataIndex: 'name',
        sorter: (a,b) => a.name.localeCompare(b.name)  
    }, 
    {
        title: 'Email',
        dataIndex: 'email',
        sorter: (a,b) => a.email.localeCompare(b.email)  
    },  
    {
        title: 'Gender',
        dataIndex: 'gender',
		filters: [
			{
				text: 'Male',
				value: 'male',
			},
			{
				text: 'Female',
				value: 'female',
			},
		],
		filterSearch: true,
    	onFilter: (value, record) => record.gender === value
    }, 
	{
		title: "Created On",
		dataIndex: "createdAt",
		render: (text, record) => formatDate(text)
	},
	{
		title: "Last Updated",
		dataIndex: "updatedAt",
		render: (text, record) => formatDate(text)
	},
	{
        title: 'Status',
        dataIndex: 'status',
		filters: [
			{
				text: 'active',
				value: 'active',
			},
			{
				text: 'inactive',
				value: 'inactive',
			},
		],
		filterSearch: true,
    	onFilter: (value, record) => record.status === value,
		render: (text, record) => { 
			return text === 'active' ? 
			<Tag color="green">active</Tag>
			:
			<Tag color="red">inactive</Tag>
		}
    }, 
	{
        title: 'Action',
        render: (text, record) => (
            <Button type="primary" ghost onClick={() => record.onEdit(record._id)}>
                <EditOutlined /> Edit
            </Button>
        ),
    },
	
];

function HomePage() {
	const navigate = useNavigate();
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(false);
	const [searchResults, setSearchResults] = useState([]);
	const [userData, setUserData] = useState([]);
	const [visible, setVisible] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const searcher = new FuzzySearch(
        users,
        [
			"id",
            "name"
        ],
        { caseSensitive: false }
    );
	const csvLink = useRef(null);

	useEffect(() => {
		loadUsers();
	}, []);

	const onEdit = (id) => { 
		navigate(`/edit/${id}`);
	}

	const loadUsers = async () => { 
		setLoading(true);

		const users = await apis.users.getUsers();
		
		for(let user of users){
			user.onEdit = onEdit;
		}

		setUsers(users);
		setLoading(false);
	}

	const onChangeHandler = (e) => {
		let value = e.target.value;

		setSearchQuery(value);

		console.log("value: ", value);

        if (value === "") {
            setSearchResults([]);
        } else {
            let query = value.trim();

            if (query !== "") {
                const results = searcher.search(query);
                setSearchResults(results);
            }
        }
    }

	const exportToCSV = async () => { 
		apis.users.exportData()
			.then(data => {
				data = data.replace(/["]+/g, '');
				console.log(data);
				setUserData(data);
			})
			.then(() => csvLink.current.link.click());
	}

	async function confirm(e) {
		await apis.users.populateDB();
		await loadUsers();

		notification.open({
			message: 'Database reset successfully',
			description: 'The database has been reset successfully. All the previous data has been deleted and been reverted back to the original data.',
			onClick: () => {
				console.log('Notification Clicked!');
			},
		});
	}
	
	return (
		<Layout>
			<div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
				<Title level={2}>Users</Title>				
			</div>	

			<Divider/>

			<CSVLink
				data={userData}
				filename='users.csv'
				className='hidden'
				ref={csvLink}
				target='_blank'
			/>

			<div className={styles.controlRow}>
				<div>
					<Input 
						placeholder="Search by id or name" 
						value={searchQuery}
						prefix={<SearchOutlined />}
						style={{marginRight: "10px", width: "250px"}} 
						allowClear
						onChange={onChangeHandler}
					/>

					<Button onClick={exportToCSV} >
						<ExportOutlined /> Export to csv
					</Button>
				</div>

				<Popconfirm
					title="Are you sure you want to reset the DB? This will delete all current data and reset the DB back to the original"
					onConfirm={confirm}
					okText="Yes"
					cancelText="No"
				>
					<Button>
						<RestOutlined /> Reset Database
					</Button>
				</Popconfirm>
			</div>
			
			<Table 
				columns={columns} 
				dataSource={searchQuery !== "" ? searchResults : users} 
				loading={loading}
			/>
		</Layout>
	)
}

export default HomePage;