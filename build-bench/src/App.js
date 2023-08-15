import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import Benchmark from './BuildBenchmark.js';
import Header from 'components/Header.js';
import 'components/resources/css/Shared.css';
import { BrowserRouter, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import AboutDialog from './dialogs/AboutDialog.js';
import { ReactComponent as Logo } from 'components/resources/ico/bb.svg';
import BuildFetch from './BuildFetch.js';
import DefaultSettings from 'components/DefaultSettings.js';
import ContainersDialog from 'components/dialogs/ContainersDialog.js';

const url = process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : window.location.origin;

function BenchWrapper(props) {
    const { id } = useParams();
    return <Benchmark url={props.url} id={id} maxCodeSize={props.maxCodeSize} timeout={props.timeout} containers={props.containers} pullContainer={props.pullContainer} onLocationChange={props.onLocationChange} />
}

function MyRoutes(props) {
    const navigate = useNavigate();

    return <Routes>
        <Route exact path="/" element={<BenchWrapper url={props.url} maxCodeSize={props.maxCodeSize} timeout={props.timeout} containers={props.containers} pullContainer={props.pullContainer} onLocationChange={(l) => navigate("/b/" + l)} />} />
        <Route exact path="/b/:id" element={<BenchWrapper url={props.url} maxCodeSize={props.maxCodeSize} timeout={props.timeout} containers={props.containers} pullContainer={props.pullContainer} onLocationChange={(l) => navigate("/b/" + l)} />} />
    </Routes>;
}

export default function App() {
    const [showAbout, setShowAbout] = useState(false);
    const [maxCodeSize, setMaxCodeSize] = useState(20000);
    const [timeout, setTimeout] = useState(60);
    const [downloadContainers, setDownloadContainers] = useState(false);
    const [showContainers, setShowContainers] = useState(false);
    const [containers, setContainers] = useState(DefaultSettings.allCompilers);

    useEffect(() => {
        BuildFetch.fetchEnv(env => {
            if (!env) {
                return;
            }
            setTimeout(env.timeout);
            setMaxCodeSize(env.maxCodeSize);
            setContainers(env.containers);
            setDownloadContainers(env.containerDl);
            return () => { };
        });
    }, [setTimeout, setMaxCodeSize, setContainers, setDownloadContainers]);
    return (
        <BrowserRouter>
            <div className="one-page">
                <div className="fixed-content">
                    <Header brand={<><Logo className="line-img me-2" style={{ fill: "#FFFFFF" }} title="logo" /> Compare C++ Builds</>} entries={() => this.renderEntries()} motd={{ url: "https://github.com/FredTingaud/bench-runner", text: "Run Build Bench locally" }}>
                        <Dropdown.Item onClick={() => setShowAbout(true)}>About Build Bench</Dropdown.Item>
                    </Header>
                </div>
                <MyRoutes url={url} maxCodeSize={maxCodeSize} timeout={timeout} containers={containers} pullContainer={downloadContainers ? (() => setShowContainers(true)) : null} />
            </div>
            <AboutDialog show={showAbout} onHide={() => setShowAbout(false)} />
            <ContainersDialog show={showContainers} onHide={() => setDownloadContainers(false)} containers={containers} containersChanged={c => setContainers(c)} />
        </BrowserRouter>
    );
}
