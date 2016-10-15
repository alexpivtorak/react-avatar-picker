import React, {Component} from 'react';
import RoundedImage from './RoundedImage';

const AvatarList = ({show, avatars, onPickAvatar, onClickAvatar, hideLoading}) => {
    const classShown = show ? 'is-shown animated' : 'is-hidden animated';
    const className = `avatarList ${ classShown }`;

    return (
        <div className={ className }>
            <h3>Choose your avatar</h3>
            <ul>
                {
                    avatars.map((avatar, index) => (
                        <li
                            tabIndex={ index + 2 }
                            key={ index }
                            onClick={ () => onPickAvatar(index) }
                            onKeyPress={ (e) => {
                                if (e.charCode == 13) {
                                    onPickAvatar(index)
                                }
                            }}
                        >
                            <RoundedImage
                                img={ avatar.src }
                                onClick={ onClickAvatar }
                                hideLoading={ hideLoading }
                            />
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

export default AvatarList;
