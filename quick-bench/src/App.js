import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import QuickBenchmark from './QuickBenchmark.js';
import Header from 'components/Header.js';
import 'components/resources/css/Shared.css';
import { BrowserRouter, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import AboutDialog from './dialogs/AboutDialog.js';
import BenchmarkDialog from './dialogs/BenchmarkDialog.js';
import { ReactComponent as Logo } from 'components/resources/ico/qb.svg';
import QuickFetch from './QuickFetch.js';
import DefaultSettings from 'components/DefaultSettings.js';
import ContainersDialog from 'components/dialogs/ContainersDialog.js';

function BenchWrapper(props) {
    const { id } = useParams();
    return <QuickBenchmark id={id} maxCodeSize={props.maxCodeSize} timeout={props.timeout} containers={props.containers} pullContainer={props.pullContainer} onLocationChange={props.onLocationChange} />
}

function MyRoutes(props) {
    const navigate = useNavigate();

    return <Routes>
        <Route exact path="/" element={<BenchWrapper maxCodeSize={props.maxCodeSize} timeout={props.timeout} containers={props.containers} pullContainer={props.pullContainer} onLocationChange={(l) => navigate("/q/" + l)} />} />
        <Route exact path="/q/:id" element={<BenchWrapper maxCodeSize={props.maxCodeSize} timeout={props.timeout} containers={props.containers} pullContainer={props.pullContainer} onLocationChange={(l) => navigate("/q/" + l)} />} />
    </Routes>;
}

export default function App() {
    const [showAbout, setShowAbout] = useState(false);
    const [showBenchmark, setShowBenchmark] = useState(false);
    const [maxCodeSize, setMaxCodeSize] = useState(20000);
    const [timeout, setTimeout] = useState(60);
    const [downloadContainers, setDownloadContainers] = useState(false);
    const [showContainers, setShowContainers] = useState(false);
    const [containers, setContainers] = useState(DefaultSettings.allCompilers);

    useEffect(() => {
        QuickFetch.fetchEnv(env => {
            if (!env)
                return;
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
                    <Header brand={<><Logo className="line-img me-2" style={{ fill: "#FFFFFF" }} title="logo" /> Quick C++ Benchmark</>} motd={{ url: "https://github.com/FredTingaud/bench-runner", text: "Run Quick Bench locally" }}>
                        <Dropdown.Item onClick={() => setShowAbout(true)}>About Quick Bench</Dropdown.Item>
                        <Dropdown.Item onClick={() => setShowBenchmark(true)}>How to write my benchmarks</Dropdown.Item>
                    </Header>
                </div >
                <MyRoutes maxCodeSize={maxCodeSize} timeout={timeout} containers={containers} pullContainer={downloadContainers ? (() => setShowContainers(true)) : null} />
            </div>
            <AboutDialog show={showAbout} onHide={() => setShowAbout(false)} />
            <BenchmarkDialog show={showBenchmark} onHide={() => setShowBenchmark(false)} />
            <ContainersDialog show={showContainers} onHide={() => setDownloadContainers(false)} containers={containers} containersChanged={c => setContainers(c)} />
        </BrowserRouter>
    );
}
