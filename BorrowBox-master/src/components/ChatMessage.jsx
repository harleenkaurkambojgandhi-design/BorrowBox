const ChatMessage = ({ text, sender, isMine, createdAt }) => {
	const ts = createdAt ? new Date(createdAt).toLocaleTimeString() : '';

	return (
		<div className={`message-row ${isMine ? 'mine' : 'theirs'}`}>
			<div className='bubble'>
				<div>
					<strong className='me-0'>{sender}</strong>
				</div>
				<div style={{ marginTop: 6 }}>{text}</div>
				{ts && <div className='message-meta'>{ts}</div>}
			</div>
		</div>
	);
};

export default ChatMessage;
