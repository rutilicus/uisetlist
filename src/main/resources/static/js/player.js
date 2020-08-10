'use strict';

class Player extends React.Component {
    constructor(props) {
        super(props);
        this.state = { control: true };
    }

    render() {
/*
        return(
            <div>
                <div id="player"></div>
                {this.state.control &&
                    <fieldset className="controlButtons">
                        <legend>曲終了後プレーヤー制御</legend>
                        <p>
                            <input type="radio" id="none" name="playerControl"
                                   value="none" onClick={onControlFuncChanged}
                                   defaultChecked/>
                            <label htmlFor="none">制御なし</label>
                        </p>
                        <p>
                            <input type="radio" id="loop" name="playerControl"
                                   value="loop" onClick={onControlFuncChanged}/>
                            <label htmlFor="loop">1曲ループ</label>
                        </p>
                        <p>
                            <input type="radio" id="next" name="playerControl"
                                   value="next" onClick={onControlFuncChanged}/>
                            <label htmlFor="next">次の曲に移動</label>
                        </p>
                    </fieldset>
                }
            </div>
        );
*/
        return React.createElement("div", null, React.createElement("div", {
                 id: "player"
               }), this.state.control && React.createElement("fieldset", {
                 className: "controlButtons"
               }, React.createElement("legend", null, "\u66F2\u7D42\u4E86\u5F8C\u30D7\u30EC\u30FC\u30E4\u30FC\u5236\u5FA1"), React.createElement("p", null, React.createElement("input", {
                 type: "radio",
                 id: "none",
                 name: "playerControl",
                 value: "none",
                 onClick: onControlFuncChanged,
                 defaultChecked: true
               }), React.createElement("label", {
                 htmlFor: "none"
               }, "\u5236\u5FA1\u306A\u3057")), React.createElement("p", null, React.createElement("input", {
                 type: "radio",
                 id: "loop",
                 name: "playerControl",
                 value: "loop",
                 onClick: onControlFuncChanged
               }), React.createElement("label", {
                 htmlFor: "loop"
               }, "1\u66F2\u30EB\u30FC\u30D7")), React.createElement("p", null, React.createElement("input", {
                 type: "radio",
                 id: "next",
                 name: "playerControl",
                 value: "next",
                 onClick: onControlFuncChanged
               }), React.createElement("label", {
                 htmlFor: "next"
               }, "\u6B21\u306E\u66F2\u306B\u79FB\u52D5"))));
    }
}
