import React, {Component} from 'react';

class RoundedImage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false
        };
    }

    componentWillReceiveProps(props) {
        if (props.hideLoading) {
            this.setState({
                loading: false
            })
        }
    }

    onClick() {
        this.setState({
            loading: true
        });
    }

    render() {
        const classLoading = this.state.loading ? 'is-loading' : '';
        const classAvatarLoading = `rounded ${ classLoading }`;
        return (
            <div
                className={ classAvatarLoading }
                onClick={ this.onClick.bind(this) }
            >
                <img src={ this.props.img } alt=""/>
            </div>
        )
    }

}

export default RoundedImage;
