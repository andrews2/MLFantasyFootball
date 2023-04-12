/*
* Created by Andrew Shipman
* 4/12/2023
*/
import { Button, Drawer } from 'antd'
import { useCallback, useState } from 'react'

export default function Home() {
  const [showDrawer, setShowDrawer] = useState(false);

  const onDrawerClose = useCallback(() => {
    setShowDrawer(false);
  }, []);

  const onButtonClick = useCallback(() => {
    setShowDrawer(true);
  }, []);

  return (
    <>
      <Drawer open={showDrawer} onClose={onDrawerClose} placement="left">
        <p>Hello World</p>
      </Drawer>
      <Button onClick={onButtonClick}>open</Button>
    </>
  )
}
