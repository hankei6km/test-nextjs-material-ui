import React, { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
// import CardMedia from '@material-ui/core/CardMedia';
import TextField from '@material-ui/core/TextField';
import Skeleton from '@material-ui/lab/Skeleton';

export default function Mypage() {
  const [inputText, setInputText] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [imgStat, setImgStat] = useState('');

  const ref = useCallback((node) => {
    if (node != null && node.complete) {
      // console.log(node);
      setImgStat('done');
    }
  }, []);

  useEffect(() => {
    let id = setTimeout(() => {
      setImgStat(inputText === '' ? 'none' : 'loading');
      setImgUrl(inputText);
      // id = 0;
    }, 500);
    return () => {
      id !== 0 && clearTimeout(id);
    };
  }, [inputText]);

  return (
    <Container maxWidth="sm">
      <Head>
        <title>テストのページ</title>
      </Head>
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          テストのページ
        </Typography>
        <NextLink href={'/'}>
          <a>index</a>
        </NextLink>
      </Box>
      <Box>
        <Card>
          {imgStat === 'loading' && <Skeleton variant="rect" height={200} />}
          {imgUrl ? (
            <img
              ref={ref}
              style={{ display: imgStat === 'done' ? 'block' : 'none' }}
              src={imgUrl}
              alt=""
              height={200}
              onLoad={() => {
                setImgStat('done');
              }}
              onError={(e) => {
                setImgStat('err');
              }}
            />
          ) : (
            <div style={{ height: 200 }} />
          )}
        </Card>
        <TextField
          label="image url"
          defaultValue={''}
          onChange={(e) => {
            ///setImgRect(<CardMedia style={{ height: 200 }} image={imgUrl} />);
            setInputText(e.target.value);
          }}
        />
      </Box>
    </Container>
  );
}
