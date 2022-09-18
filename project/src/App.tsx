import React, { useState, useEffect, useMemo, FC } from 'react'
import canvasTxt from './canvas-txt'
import './App.less'
import { modzi, anji } from 'lojban'

import {
  Button,
  Space,
  Layout,
  Form,
  Input,
  Select,
  Card,
  Slider,
} from 'antd'


const { Content } = Layout
const { Option } = Select

interface MyProps {
  children?: React.ReactNode
  text: string
  fullText?: string
  setText: any
}

const Butt: FC<MyProps> = ({ text, fullText, setText }) => {
  return (
    <Button
      type="dashed"
      size="small"
      onClick={() => {
        setText(fullText ?? text)
      }}
    >
      {text}
    </Button>
  )
}

const App: any = () => {
  let search = window?.location?.search;
  let params = new URLSearchParams(search);
  const query_text = params.get('text');

  // const myWorker = new Worker('worker.js');

  // const [collapsed, setCollapsed] = useState(false)
  const [text, setText] = useState(query_text || '')
  const defaultSize = 100
  const [src, setSrc] = useState(
    'data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA='
  )
  const [size, setSize] = useState(defaultSize)
  const [family, setFamily] = useState('emoji')

  const canvas_width = 300
  const canvas_height = 50

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  }

  const fonts = useMemo(
    () => [
      { name: 'Emoji', value: 'emoji', line: 1.5 },
      { name: 'Hanzi', value: 'anji', line: 1.5 },
      { name: 'Vrude', value: 'vrude-regular', line: 1.2 },
      { name: 'Crisa', value: 'crisa', line: 1.2 },
    ],
    []
  )

  const UNICODE_START = 0xed80
  const lerfu_index = "ptkflscmx.' 1234bdgvrzjn`-,~    aeiouy    qw    AEIOUY"

  // const toggle = () => {
  //   setCollapsed(!collapsed)
  // }

  useEffect(() => {
    async function areFontsReady() {
        await (document as any).fonts.ready
        try {
          const im: any = document.getElementById('myImage')
          im.setAttribute("data:fonts-loaded", true);
        } catch (error) {
        }
    }

    areFontsReady()
})

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!text)
        for (const font of fonts) call({ text: '', font: font.value, size })
      else call({ text, font: family, size })
    }, 100)

    function krulermorna(t: string) {
      return t
        .replace(/\./g, '')
        .replace(/^/, '.')
        .toLowerCase()
        .replace(/([aeiou.])u([aeiou])/g, '$1w$2')
        .replace(/([aeiou.])i([aeiou])/g, '$1ɩ$2')
        .replace(/au/g, 'ḁ')
        .replace(/ai/g, 'ą')
        .replace(/ei/g, 'ę')
        .replace(/oi/g, 'ǫ')
        .replace(/\./g, '')
    }
    function cohukrulermorna(t: string) {
      return t
        .replace(/w/g, 'u')
        .replace(/ɩ/g, 'i')
        .replace(/ḁ/g, 'au')
        .replace(/ą/g, 'ai')
        .replace(/ę/g, 'ei')
        .replace(/ǫ/g, 'oi')
    }
    function latinToZbalermorna(c: string) {
      if ((c.codePointAt(0) ?? 0) >= 0xed80) {
        return c ?? ''
      }
      if (c === ' ') return ' '
      if (c === 'h' || c === 'H') c = "'"
      if (lerfu_index.includes(c))
        return String.fromCodePoint(UNICODE_START + lerfu_index.indexOf(c))
      else if (lerfu_index.includes(c.toLowerCase()))
        return String.fromCodePoint(
          UNICODE_START + lerfu_index.indexOf(c.toLowerCase())
        )
      if (c === '\n') return '\n'
      if (c === '\t') return '\t'
      return c
    }

    function preprocess({ text, font }: { text: string; font: string }) {
      if (['crisa', 'vrude', 'vrude-regular'].includes(font)) {
        const ot = "vlaza'umei"
        const rfs = text.split(' ').map((valsi: string) => {
          return { w: valsi, rfs: [] }
        })
        return zbalermornaize({ w: '', ot, rfs })
      } else if (['modzi', 'emoji'].includes(font)) {
        return modzi(text, false)
      } else if (['anji'].includes(font)) {
        return anji(text)
      } else return text
    }

    function zbalermornaize({
      w,
      ot,
      rfs,
    }: {
      w: string
      ot: string
      rfs: any[]
    }): string | string[] {
      let word = krulermorna(w)
      if (ot === "vlaza'umei") {
        return rfs.map((def) => zbalermornaize(def)).join(' ')
      }
      word = word
        .split(/(?=[ɩw])/)
        .map((spisa: string) =>
          cohukrulermorna(spisa)
            .split('')
            .map((lerfu: string) => latinToZbalermorna(lerfu))
            .join('')
        )
        .join('')
      return word.replace(/,/g, '')
    }

    function call({
      text,
      font,
      size,
      redraw = true,
    }: {
      text: string
      font: string
      size: number
      redraw?: boolean
    }) {
      const content = document.getElementById('content')
      const c: any = document.getElementById('myCanvas')
      const im: any = document.getElementById('myImage')
      const ctx = c.getContext('2d')

      canvasTxt.lineHeight =
        (fonts.filter((i: any) => i.value === font)[0].line ?? 1.2) * size
      canvasTxt.fontSize = size
      canvasTxt.font = font
      canvasTxt.vAlign = 'top'
      // canvasTxt.justify = true
      let ratio = window.devicePixelRatio
      const w = content.clientWidth - 10
      const h = c.height / ratio
      const w_ = w * ratio
      const h_ = h * ratio
      c.style.width = w.toString() + 'px'
      c.style.height = h.toString() + 'px'
      im.style.width = w.toString() + 'px'
      im.style.height = h.toString() + 'px'
      c.width = w_
      c.height = h_
      /* todo: possibly scale canvas
      // ctx.scale(1 / ratio, 1 / ratio)
      */

      const { height } = canvasTxt.drawText(
        ctx,
        preprocess({ text: (text ?? '').trim(), font }),
        0,
        size / 3,
        w_,
        h_
      )
      ctx.globalCompositeOperation = 'destination-over'
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, ctx.width, ctx.height)
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      ctx.globalCompositeOperation = 'source-over'

      setSrc(c.toDataURL('image/jpeg', 1))
      if (redraw) {
        im.style.height = c.height = c.style.height = Math.max(
          height + (size * 2) / 3,
          canvas_height
        )

        call({
          text,
          font,
          size,
          redraw: false,
        })
      }
    }
    return () => {
      clearTimeout(timeout)
    }
  }, [fonts, text, size, family])

  return (
    <>
      <Layout>
        {/* <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="logo" />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1" icon={<UserOutlined />}>
              nav 1
            </Menu.Item>
            <Menu.Item key="2" icon={<VideoCameraOutlined />}>
              nav 2
            </Menu.Item>
            <Menu.Item key="3" icon={<UploadOutlined />}>
              nav 3
            </Menu.Item>
          </Menu>
        </Sider> */}
        <Layout className="site-layout">
          {/* <Header className="site-layout-background" style={{ padding: 0 }}>
            {collapsed ? (
              <MenuUnfoldOutlined
                className="trigger"
                onClick={() => toggle()}
              />
            ) : (
              <MenuFoldOutlined className="trigger" onClick={() => toggle()} />
            )}
          </Header> */}
          <Content
            className="site-layout-background"
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
            }}
          >
            <Form
              {...layout}
              name="nest-messages"
              initialValues={{
                font: 'emoji',
                size: defaultSize,
              }}
            >
              <Form.Item name={['text']} label="Text">
                <Input
                  allowClear
                  type="text"
                  value={text}
                  onChange={({ target: { value } }) => {
                    setText(value)
                  }}
                />
                <Space size={[8, 16]} wrap style={{marginTop: '1em'}}>
                  <Butt text="coi ro do ma nuzba" setText={setText} />
                  <Butt text="mi prami do" setText={setText} />
                  <Butt
                    text="do noi mamgle"
                    fullText="do noi mamgle i ko co'e doi se zargu be le cmalu i mabla jikca mi pei i do noi mabla cmalu se zargu gi'e se tance le sakli be le pinji i do mabla zukte e'e pei i e'e pei jikca mi i mi ba cpacu le zargu be do ga'i i ge'e do noi mamgle i a'o gletu do e ro lu'a le lanzu be do i e'e pei do noi pencu le pinji doi culno be le fusra doi bebna se flira be le kalci i e'e pei doi citka be le se cigla do jikca mi pei i e'e pei doi se zargu"
                    setText={setText}
                  />
                </Space>
              </Form.Item>
              <Form.Item name="font" label="Font">
                <Select
                  onChange={(value: string) => {
                    setFamily(value)
                  }}
                >
                  {fonts.map((i) => {
                    return (
                      <Option key={i.value} value={i.value}>
                        {i.name}
                      </Option>
                    )
                  })}
                </Select>
              </Form.Item>
              <Form.Item name="size" label="Size">
                <Slider
                  min={50}
                  max={200}
                  onChange={(value: number) => {
                    setSize(value)
                  }}
                  value={typeof size === 'number' ? size : defaultSize}
                />
              </Form.Item>
            </Form>
            <Card style={{ textAlign: 'center' }}>
              <div id="content">
                <canvas id="myCanvas" style={{ display: 'none' }}></canvas>
                <img
                  id="myImage"
                  alt="text"
                  src={src}
                  style={{
                    outline: '1px solid #000',
                    width: canvas_width,
                    height: canvas_height,
                  }}
                />
              </div>
            </Card>
          </Content>
        </Layout>
      </Layout>
    </>
  )
}

export default App
