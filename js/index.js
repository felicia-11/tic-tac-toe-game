$(document).ready(function () {
    var x = "x"
    var o = "o"
    var count = 0;
    var oWin = 0;
    var xWin = 0;
    var hasWin = false;
    const initialBoardSize = 3;

    $(window).load(function () {
        for(let i = 0; i < initialBoardSize / 3; i++) {
            $("#game").append("<ul id='board_" + i + "'></ul>");
            for(let j = 0; j < 9; j++) {
                const currId = '#board_' + i;
                $(currId).append("<li id='tile_" + j + "' class='btn tile'>+</li>");
            };
        };
    });

    function resetGame () {
        hasWin = false;
        $("#game li").text("+");
        $("#game li").attr('class', 'btn tile');
        count = 0;
    };

    function checkVerticalFromTop (turn, player) {
        return $("#tile_" + turn).hasClass(player) && $("#tile_" + (turn + 3)).hasClass(player) && $("#tile_" + (turn + 6)).hasClass(player);
    };
    function checkVerticalFromMiddle (turn, player) {
        return $("#tile_" + turn).hasClass(player) && $("#tile_" + (turn + 3)).hasClass(player) && $("#tile_" + (turn - 3)).hasClass(player);
    };
    function checkVerticalFromBottom (turn, player) {
        return $("#tile_" + turn).hasClass(player) && $("#tile_" + (turn - 3)).hasClass(player) && $("#tile_" + (turn - 6)).hasClass(player);
    };

    function checkWinner (id, player) {
        const turn = parseInt(id.replace("tile_", ""), 10);
        const turnRow = Math.floor(turn / 3);

        if (turn % 3 == 0) {
            if ($("#tile_" + turn).hasClass(player) && $("#tile_" + (turn + 1)).hasClass(player) && $("#tile_" + (turn + 2)).hasClass(player)) {
                return true;
            } else if (turnRow % 3 == 0 && ($("#tile_" + turn).hasClass(player) && $("#tile_" + (turn + 4)).hasClass(player) && $("#tile_" + (turn + 8)).hasClass(player) || checkVerticalFromTop(turn, player))) {
                return true;
            } else if (turnRow % 3 == 1 && (checkVerticalFromMiddle(turn, player))) {
                return true;
            } else if (turnRow % 3 == 2 && ($("#tile_" + turn).hasClass(player) && $("#tile_" + (turn - 2)).hasClass(player) && $("#tile_" + (turn - 4)).hasClass(player) || checkVerticalFromBottom(turn, player))) {
                return true;
            }
        } else if (turn % 3 == 1) {
            if ($("#tile_" + turn).hasClass(player) && $("#tile_" + (turn + 1)).hasClass(player) && $("#tile_" + (turn - 1)).hasClass(player)) {
                return true;
            } else if (turnRow % 3 == 0 && (checkVerticalFromTop(turn, player))) {
                return true;
            } else if (turnRow % 3 == 1 && (checkVerticalFromMiddle(turn, player) || $("#tile_" + turn).hasClass(player) && $("#tile_" + (turn + 4)).hasClass(player) && $("#tile_" + (turn - 4)).hasClass(player) || $("#tile_" + turn).hasClass(player) && $("#tile_" + (turn + 2)).hasClass(player) && $("#tile_" + (turn - 2)).hasClass(player))) {
                return true;
            } else if (turnRow % 3 == 2 && (checkVerticalFromBottom(turn, player))) {
                return true;
            }
        } else if (turn % 3 == 2) {
            if ($("#tile_" + turn).hasClass(player) && $("#tile_" + (turn - 1)).hasClass(player) && $("#tile_" + (turn - 2)).hasClass(player)) {
                return true;
            } else if (turnRow % 3 == 0 && (checkVerticalFromTop(turn, player) || $("#tile_" + turn).hasClass(player) && $("#tile_" + (turn + 2)).hasClass(player) && $("#tile_" + (turn + 4)).hasClass(player))) {
                return true;
            } else if (turnRow % 3 == 1 && (checkVerticalFromMiddle(turn, player))) {
                return true;
            } else if (turnRow % 3 == 2 && ($("#tile_" + turn).hasClass(player) && $("#tile_" + (turn - 4)).hasClass(player) && $("#tile_" + (turn - 8)).hasClass(player) || checkVerticalFromBottom(turn, player))) {
                return true;
            }
        } else {
            return false;
        }
    };

    $('#game').on("click", "li", function () {
        const currSize = parseInt($("#board_size").val(), 10);

        if (!$(this).hasClass('disabled') && !hasWin) {
            if (count % 2 == 0) {
                count++;
                $(this).text(o);
                $(this).addClass('disabled o btn-primary');

                const result = checkWinner($(this).attr('id'), 'o');
                if (result) {
                    alert('O wins');
                    count = 0;
                    oWin++;
                    $('#o_win').text(oWin);
                    hasWin = true;
                } else if (count == (currSize * currSize)) {
                    alert('Its a tie. Press restart to play again.');
                }
            }
            else {
                count++;
                $(this).text(x);
                $(this).addClass('disabled x btn-info');
                
                const result = checkWinner($(this).attr('id'), 'x');
                if (result) {
                    alert('X wins');
                    count = 0;
                    xWin++;
                    $('#x_win').text(xWin);
                    hasWin = true;
                } else if (count == (currSize * currSize)) {
                    alert('Its a tie. Press restart to play again.');
                }
            }
        } else if (!$(this).hasClass('disabled') && hasWin) {
            alert((count % 2 == 0 ? "O" : "X") + " wins has won the game. Start a new game");
            resetGame();
        }
    });

    $("#btnApply").click(function () {
        const newSize = parseInt($("#board_size").val(), 10);
        const isReset = confirm("Current game will be restarted. Change board size into " + newSize + " x " + newSize + "?");

        if (isReset) {
            $("#game").empty();
            count = 0;

            for(let i = 0; i < newSize / 3; i++) {
                const rowId = "row_" + i;
                $("#game").append("<div id=" + rowId + " class='board_row'></div>");

                const rowSize = 220 * newSize / 3;
                $("#" + rowId).css('width', rowSize);
                $(".container.board").css('width', rowSize);

                for(let j = 0; j < newSize / 3; j++) {
                    const currBoard = "#game #row_" + i;
                    const boardIdx = (i * 3) + j;
                    $(currBoard).append("<ul id='board_" + boardIdx + "'></ul>");

                    for(let k = 0; k < 9; k++) {
                        const boardId = "#board_" + boardIdx;
                        const tileIdx = (i * newSize * 3) + (j * 9) + k;

                        $(boardId).append("<li id='tile_" + tileIdx + "' class='btn tile'>+</li>");
                    };
                }
            };
        }
    });

    $("#reset").click(function () {
        const currSize = parseInt($("#board_size").val(), 10);
        if (count == (currSize * currSize) || hasWin) {
            resetGame();
        } else {
            const isReset = confirm("Are you sure you want to restart the game?");
            if (isReset) resetGame();
        }
    });
});
