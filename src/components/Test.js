import React, { useState } from 'react';
import { connect } from 'react-redux';
import { testOne } from '../actions/actions'

const Test = ({ finalData, changeFinalData }) => {

    let [data, setData] = useState('');

    const handleChange = e => setData(e.target.value)
    const handleSubmit = e => {
        e.preventDefault()
        changeFinalData(data)
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <input value={data} onChange={handleChange}/>
                <br/>
                <button>Submit</button>
            </form>
            <p>{finalData}</p>
        </>
    )
}

const mapStateToProps = state => ({
    finalData: state.data.propertyOne
})

const mapDispatchToProps = dispatch => ({
    changeFinalData: (data) => dispatch(testOne(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(Test);