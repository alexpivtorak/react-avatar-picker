import React, {Component} from 'react';
const enhanceWithClickOutside = require('react-click-outside');
import 'whatwg-fetch';
import AvatarsData from "../../data/data";

import AvatarHeader from "./partials/AvatarHeader";
import AvatarList from "./partials/AvatarList";


class AvatarPicker extends Component {
    constructor(props) {
        super(props);

        this.state = {
            list: AvatarsData.list,
            endPoint: AvatarsData.endPoint,
            listShown: false
        };
    }

    getImage(index) {
        return this.state.list[index];
    }

    sendRequest(index) {
        const that = this;
        fetch(this.state.endPoint, {
            method: 'post',
            body: JSON.stringify(that.getImage(index))
        }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                return response.json();
            }
            throw new Error("Error Happened");
        }).then(() => {
            setTimeout(function () {
                that.setState({
                    list: that.updateAvatarList(index),
                    listShown: false,
                    loading: false
                });
            }, 1000);
        }).catch((err) => {
            console.log(err);
        });
    }

    updateAvatarList(index) {
        let avatars = this.state.list;
        let el = this.state.list[index];
        avatars.splice(index, 1);
        avatars.unshift(el);

        return avatars;
    }

    onPickAvatar(index) {
        this.setState({
            loading: true
        });
        this.sendRequest(index);
    }

    onShowList() {
        this.setState({
            listShown: true
        })
    }

    handleClickOutside() {
        this.setState({
            listShown: false
        })
    }

    render() {
        const activeImg = this.state.list[0].src;
        const overflowHidden = this.state.listShown ? '' : 'is-overflowed'
        const classPicker = `avatarPicker ${ overflowHidden }`;
        return (

            <div className={ classPicker }>

                <AvatarHeader
                    img={ activeImg }
                    onShowList={ this.onShowList.bind(this) }
                />

                <AvatarList
                    show={ this.state.listShown }
                    avatars={ this.state.list }
                    onPickAvatar={ this.onPickAvatar.bind(this) }
                    hideLoading={ !this.state.loading }
                />

            </div>

        );
    }
}


export default enhanceWithClickOutside(AvatarPicker);
