import React, { useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import TextField from '@material-ui/core/TextField';

export default function Mypage() {
  const [imgUrl, setImgUrl] = useState('');
  return (
    <Container maxWidth="sm">
      <Head>
        <title>テストのページ</title>
      </Head>
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          テストのページ
        </Typography>
        <Typography variant="body1" gutterBottom>
          このPRはリポジトリのリネームをした後、CodeSandboxや Vercel
          側の挙動がどうなるか確認するためのもの。 これはリネーム前。
          リネームした。
        </Typography>
        <NextLink href={'/'}>
          <a>index</a>
        </NextLink>
      </Box>
      <Box>
        <Card>
          <CardMedia style={{ height: 200 }} image={imgUrl} />
        </Card>
        <TextField
          id="standard-basic"
          label="Standard"
          defaultValue={''}
          onChange={(e) => {
            setImgUrl(e.target.value);
          }}
        />
      </Box>
    </Container>
  );
}
