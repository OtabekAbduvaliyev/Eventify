import React from "react";
import testMemImg from '../../assets/5d3c4f61d58fc049b8def14e6d66662b.png'
import { FiUserPlus } from 'react-icons/fi'
import InviteMemberModal from '../Modals/InviteMemberModal'
import { useState } from "react";
const Members = () => {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  return (
    <div>
      <div className="bg-grayDash py-[16px] px-[17px] rounded-[17px] font-radioCanada mt-[18px] shadow-xl">
        <div className="frLine flex justify-between items-center">
          <h1 className="text-gray2 font-radioCanada text-[16px]">Members</h1>
          <button className="text-white text-[13px] bg-black py-[7px] px-[15px] rounded-[9px]">
            see all
          </button>
        </div>
        <div className="secLine my-[12px] space-y-[4px]">
          <div className="member flex items-center gap-[12px]">
            <div className="memImg">
              <img src={testMemImg} alt=""  className="w-[28.8px] rounded-[50%]"/>
            </div>
            <div className="memText">
              <p className="text-[14px] text-white">Sidikov Baxrom</p>
              <p className="text-[11px] text-gray2">baxromsidikov@gmail.com</p>
            </div>
          </div>
          <div className="member flex items-center gap-[12px]">
            <div className="memImg">
              <img src={testMemImg} alt=""  className="w-[28.8px] rounded-[50%]"/>
            </div>
            <div className="memText">
              <p className="text-[14px] text-white whitespace-nowrap">Alovuddinov Muhammad</p>
              <p className="text-[11px] text-gray2">muhammad@gmail.com</p>
            </div>
          </div>
          <div className="member flex items-center gap-[12px]">
            <div className="memImg">
              <img src={testMemImg} alt=""  className="w-[28.8px] rounded-[50%]"/>
            </div>
            <div className="memText">
              <p className="text-[14px] text-white">Akbarov Abdulaziz</p>
              <p className="text-[11px] text-gray2">akbarov@gmail.com</p>
            </div>
          </div>
        </div>
      </div>

      <InviteMemberModal 
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />
    </div>
  );
};

export default Members;
