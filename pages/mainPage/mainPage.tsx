import React from 'react';
import { withLayout } from '../../layout/Layout';
import s from './mainPage.module.scss';
const mainPage = () => {
    return (
        <div className={s.wrapper}>
        Привет большой член
        </div>
    );
};

export default withLayout( mainPage);