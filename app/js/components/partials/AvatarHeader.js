import React, { Component } from 'react';
import RoundedImage from './RoundedImage';

const AvatarHeader = ({img, onShowList }) => {
	return (
		<div
			tabIndex = "1"
			className = "avatarPicker__header"
			onClick = { onShowList }
			onKeyDown = { onShowList }
		>
			<RoundedImage img = { img } />
		</div>
	)
}

export default AvatarHeader;