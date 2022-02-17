import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Typography, Divider, Button, Input, Form, Select } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import Layout from '../../Components/Layout/Layout';
import apis from '../../lib/apis';

const { Title } = Typography;
const { Option } = Select;

function EditPage() {
	const { id } = useParams();
    const navigate = useNavigate();

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [status, setStatus] = useState("");
	const [gender, setGender] = useState("");
	const [loading, setLoading] = useState("");

	useEffect(() => {
		fetchUser();
	}, [])

	const fetchUser = async () => { 
		let user = await apis.users.getUser(id);

		setName(user.name);
		setEmail(user.email);
		setStatus(user.status);
		setGender(user.gender);
	}

	const onSubmit = async (e) => { 
		e.preventDefault();

		setLoading(true);

		let data = { 
			id,
			name, 
			email, 
			status, 
			gender
		};	

		console.log(data);

		await apis.users.updateUser(data);

		setLoading(false);
		navigate('/');
	}

	return (
		<Layout>
			<div style={{display: "flex", alignItems: "center"}}>
				<LeftOutlined style={{marginRight: "10px", fontSize:"25px", cursor: "pointer"}} onClick={() => navigate('/')}/> 
				<Title level={2}>Edit User</Title>
			</div>
			
			<Divider/>

			<form onSubmit={onSubmit}>
				<Form.Item label="Full Name" labelCol={{span: 2}} wrapperCol={{span: 10}} required> 
					<Input 
						placeholder='Enter Name'
						value={name}
						onChange={e => setName(e.target.value)}
					/>
				</Form.Item>

				<Form.Item label="Email" labelCol={{span: 2}} wrapperCol={{span: 10}} required> 
					<Input 
						placeholder='Enter Email'
						value={email}
						onChange={e => setEmail(e.target.value)}
						readOnly
						disabled
					/>
				</Form.Item>

				<Form.Item label="Status" labelCol={{span: 2}} wrapperCol={{span: 10}} required > 
					<Select placeholder="Select Status" value={status}  onChange={(value) => setStatus(value)}>
						<Option value="active">active</Option>
						<Option value="inactive">inactive</Option>
					</Select>    
				</Form.Item>

				<Form.Item label="Gender" labelCol={{span: 2}} wrapperCol={{span: 10}} required > 
					<Select placeholder="Select Gender" value={gender}  onChange={(value) => setGender(value)}>
						<Option value="male">male</Option>
						<Option value="female">female</Option>
					</Select>    
				</Form.Item>

				<Form.Item wrapperCol={{span: 10, offset: 2}}>
					<Button type='primary' htmlType='submit' style={{marginRight: "5px"}} loading={loading}>Save</Button>
					<Button onClick={() => navigate('/')}> Cancel </Button>
				</Form.Item>      
			</form>
		</Layout>
	)
}

export default EditPage