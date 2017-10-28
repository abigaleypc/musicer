import React from 'react';

export default class ShadeModal extends React.Component {
  constructor(props){
    super(props);
  }
  render(){
    return (
      <div style={styles.shadeModal}>
      dfsfsd
      </div>
    )
  }
}

const styles = {
  shadeModal:{
    position:'absolute',
    left:0,
    top:0,
    background:'#000',
    width:100,
    height:100,
  }
}
