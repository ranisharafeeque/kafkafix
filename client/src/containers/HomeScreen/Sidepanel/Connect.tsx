import React, { FC, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { KafkaState } from '../../../state/reducers/kafkaDataReducer';
import { overallState } from '../../../state/reducers';
import {
  connectedActionCreator,
  populateDataActionCreator,
} from '../../../state/actions/actions';
import WebSocket from 'ws';
import { Redirect } from 'react-router-dom';

// importing componenets from Material UI
import {
  Button,
  Card,
  List,
  Divider,
  Typography,
  Input,
  makeStyles,
} from '@material-ui/core';

interface Options {
  headers: {};
  body: string;
  method: string;
}
// export let ws: any;

// styles for connect Component
const useStyles = makeStyles({
  form: {
    alignSelf: 'start',
    margin: 30,
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    height: 'auto',
    width: 'auto',
    // justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
    boxShadow: '10px 5px 5px lightgrey;',
  },
  title: {
    fontWeight: 'bold',
  },
  input: {},
  button: {
    marginTop: 10,
    backgroundColor: 'red',
  },
});

const createData = (
  topicName: string,
  partitions: number,
  partitionData: any
) => {
  return {
    topicName: topicName,
    partitions: partitions,
    partitionData: partitionData.map((el: any) => ({
      id: el.partitionId,
      partitionErrorCode: el.partitionErrorCode,
      leader: !!el.leader,
      replicas: el.replicas[0],
      isr: el.isr[0],
    })),
  };
};

const Connect: FC = (props) => {
  // display form function -> onSubmit -> send fetch request to backend with Broker URI
  const isConnected = useSelector<overallState, KafkaState['isConnected']>(
    (state) => state.kafka.isConnected
  );

  const dispatch = useDispatch();

  console.log('from connect component =>', isConnected);

  // creating a classes variable to customize styles
  const classes = useStyles();

  const handleSubmit = (e: any) => {
    console.log('make it inside handlesubmit');
    e.preventDefault();
    let method;
    let inputField: HTMLInputElement | null =
      document.querySelector('#brokerID');
    let body;
    if (inputField) {
      console.log(inputField.value);
      // move down to fetch
      body = JSON.stringify({ PORT: inputField.value });
      // inputField.setAttribute("disabled", "true");
    } else {
      alert('Cannot connect because Broker ID field is empty');
      return;
    }

    if (!isConnected) {
      method = 'POST';
      console.log('106 =>', inputField);
    } else {
      method = 'PUT';
    }

    const options: Options = {
      method,
      headers: { 'content-type': 'application/json' },
      body,
    };
    // move down into fetch
    console.log(options);
    //edit the fetch api
    fetch('/api/connect', options)
      .then((data) => data.json())
      .then((data) => {
        console.log(data);
        // const { metadata: { topics: array } } = data;
        const array = data.metadata.topics;
        const rows = array.map((el: any) =>
          createData(el.name, el.partitions.length, el.partitions)
        );
        // dummy data after converting data we get back into format we want
        // const rows = [
        //   createData('topic 1', 3, [
        //     {
        //       id: 1,
        //       parttionErrode: 'test',
        //       leader: true,
        //       replicas: [3],
        //       isr: [1],
        //     },
        //   ]),
        //   createData('topic 2', 3, [
        //     {
        //       id: 1,
        //       parttionErrode: 'test',
        //       leader: true,
        //       replicas: [3],
        //       isr: [1],
        //     },
        //   ]),
        // ];
        dispatch(connectedActionCreator());
        dispatch(populateDataActionCreator(rows));
        // ws = new WebSocket("ws://localhost:3000");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <form className={classes.form}>
      <Card className={classes.card}>
        <Typography variant='h6' className={classes.title}>
          Enter Your Broker Port Number
        </Typography>
        <Divider></Divider>
        <Input
          id='brokerID'
          name='brokerID'
          type='number'
          placeholder='9092'
          // required={true}
          autoFocus={true}
        ></Input>
        <Button
          className={classes.button}
          variant='contained'
          color='primary'
          onClick={handleSubmit}
        >
          {isConnected ? 'Disconnect' : 'Connect'}
          {/* {isConnected && <Redirect to='/partition' />} */}
        </Button>
      </Card>
    </form>
  );
};

export default Connect;

// <div>
//   <label>Enter Your Broker Port Number</label>
// </div>
// <input
//   id='brokerID'
//   name='brokerID'
//   placeholder='Your Broker Port Number'
//   pattern='[0-9]+'
// ></input>
// <button>{isConnected ? 'Disconnect' : 'Connect'}</button>
