"use client";
import dynamic from 'next/dynamic';
import { AppMode } from '../appmode.js';

// 動的インポートを使用して、SSRを無効化
const DynamicHome = dynamic(() => import('../home.js'), { ssr: false });

// 仮想用の練習モード（ロボットに接続しない）
// この場合、MQTTは使わない
// この場合のみ Rapier を動かす！
export default function Home() {
  return (
      <DynamicHome appmode={AppMode.practice} />
  );
}
