'use strict';

/*
 * dependencies: song_elem.js
 */

const newListName = "新規リスト";
const addNewListChoice = "新規リストを作成する";
const selectId = "editSelect";
const listNameInput = "listName";

class EditList extends React.Component {
    constructor(props) {
        super(props);

        this.addNewList = this.addNewList.bind(this);
        this.onChange = this.onChange.bind(this);
        this.setListName = this.setListName.bind(this);
        this.deleteConfirm = this.deleteConfirm.bind(this);

        if (this.props.allSongList.length == 1) {
            // リストが全曲リストのみの場合は自動的に新規リストを作成する
            this.addNewList();
        }
    }

    addNewList() {
        this.props.addNewSongList({name: newListName, list: []});
    }

    componentDidUpdate() {
        const select = document.getElementById(selectId);
        if (select.value == this.props.allSongList.length) {
            // selectの現在値が1以外(リスト追加時)は現在値を最終追加リストに設定しなおす
            // 曲リスト長=リスト追加の値のため、曲リスト長-1が最終追加リスト
            select.value -= 1;

            // リスト名入力inputも再設定が必要なため設定処理を行う
            // ただし初期リストのみの場合で削除時はindex不正となるためなにもしない
            if (select.value > 0) {
                document.getElementById(listNameInput).value =
                    this.props.allSongList[select.value].name;
            }
        }
    }

    onChange(e) {
        const index = e.target.value;
        if (index == this.props.allSongList.length) {
            this.addNewList();
        } else {
            document.getElementById(listNameInput).value =
                this.props.allSongList[index].name;
        }
        this.props.setEditIndex(index);
    }

    setListName(e) {
        const newName = document.getElementById(listNameInput).value;
        this.props.setCurrentListName(newName);
    }

    deleteConfirm(e) {
        if (confirm("リストを削除してもよろしいですか？")) {
            let select = document.getElementById(selectId);
            const currentValue = select.value;
            this.props.removeCurrentSongList();
            select.value = currentValue - 1;
            if (select.value > 0) {
                document.getElementById(listNameInput).value =
                    this.props.allSongList[select.value].name;
            }
        }
    }

    render() {
        return(
            <div>
                <select className="songListSelect"
                        defaultValue={1}
                        onChange={this.onChange}
                        id={selectId}>
                    {this.props.allSongList.slice(1).map((list, index) => {
                        return <option key={index + 1} value={index + 1}>{list.name}</option>
                    })}
                    <option value={this.props.allSongList.length}>
                        {addNewListChoice}
                    </option>
                </select>
                {this.props.editIndex < this.props.allSongList.length &&
                 <div className="listNameEdit">
                    <input type="text"
                           id={listNameInput}
                           defaultValue={this.props.allSongList[this.props.editIndex].name} />
                    <button type="button" onClick={this.setListName}>リスト名変更</button>
                    <button type="button" onClick={this.deleteConfirm}>リスト削除</button>
                 </div>}
                <table border="1" className="songTbl">
                    <thead>
                        <tr>
                            <th>
                                <div className="songName">Song Name</div>
                                <div className="artist">Original Artist</div>
                                <div className="movieName">Movie Name</div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.editIndex < this.props.allSongList.length &&
                         this.props.allSongList[this.props.editIndex].list.map((song, index) => {
                            const props = Object.assign(song,
                                                        { key: this.props.uniqueIndex,
                                                          index: index,
                                                          onClickListener: null,
                                                          linkEnable: false,
                                                          buttonList: [{text: "↑", onClick: this.props.swapUp},
                                                                       {text: "↓", onClick: this.props.swapDown},
                                                                       {text: "Delete", onClick: this.props.removeSongFromCurrentEditList}]});
                            return <SongElem {...props } />;
                            })}
                    </tbody>
                </table>
            </div>
        );
    }
}
